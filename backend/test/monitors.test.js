import { test } from 'node:test';
import assert from 'node:assert/strict';
import controller from '../src/controllers/monitorsController.js';
import repository from '../src/repositories/monitorsRepository.js';
import monitorRouter from '../src/routers/monitorRouter.js';

test('PATCH atualiza um monitor existente', async () => {
    const originalGet = repository.getMonitor;
    const originalUpdate = repository.updateMonitor;
    const monitor = { userId: 1, get: () => ({ id: 2, logs: true }) };
    let updated = false;
    repository.getMonitor = async () => monitor;
    repository.updateMonitor = async () => { updated = true; return monitor; };
    const res = { locals: { token: { id: 1 } }, status(code) { this.code = code; return this; }, json(body) { this.body = body; }, sendStatus(code) { this.code = code; } };
    try {
        await controller.updateMonitor({ params: { id: '2' }, body: { logs: true } }, res);
        assert.equal(updated, true);
        assert.equal(res.code, 201);
    } finally {
        repository.getMonitor = originalGet;
        repository.updateMonitor = originalUpdate;
    }
});

test('DELETE /monitors/:id verifica o proprietário e exclui o monitor', async () => {
    const originalGet = repository.getMonitor;
    const originalDelete = repository.deleteMonitor;
    let deletedId;
    repository.getMonitor = async id => id === '2' ? { userId: 1 } : id === '3' ? { userId: 2 } : null;
    repository.deleteMonitor = async id => { deletedId = id; };
    const route = monitorRouter.stack.find(layer => layer.route?.path === '/:id' && layer.route.methods.delete);
    const res = { locals: { token: { id: 1 } }, sendStatus(code) { this.code = code; } };
    try {
        assert.ok(route);
        await controller.deleteMonitor({ params: { id: '3' } }, res);
        assert.equal(res.code, 403);
        await controller.deleteMonitor({ params: { id: '4' } }, res);
        assert.equal(res.code, 404);
        assert.equal(deletedId, undefined);
        await controller.deleteMonitor({ params: { id: '2' } }, res);
        assert.equal(res.code, 204);
        assert.equal(deletedId, '2');
    } finally {
        repository.getMonitor = originalGet;
        repository.deleteMonitor = originalDelete;
    }
});

test('start e stop verificam propriedade e alteram o estado do monitor', async () => {
    const originalGet = repository.getMonitor;
    const monitor = { userId: 1, isActive: false, async save() {}, get() { return { isActive: this.isActive }; } };
    repository.getMonitor = async () => monitor;
    const res = { locals: { token: { id: 1 } }, json(body) { this.body = body; }, sendStatus(code) { this.code = code; } };
    try {
        await controller.startMonitor({ params: { id: '2' } }, res);
        assert.equal(res.body.isActive, true);
        await controller.stopMonitor({ params: { id: '2' } }, res);
        assert.equal(res.body.isActive, false);
        res.locals.token.id = 3;
        await controller.stopMonitor({ params: { id: '2' } }, res);
        assert.equal(res.code, 403);
        repository.getMonitor = async () => null;
        await controller.startMonitor({ params: { id: '2' } }, res);
        assert.equal(res.code, 404);
    } finally {
        repository.getMonitor = originalGet;
    }
});
