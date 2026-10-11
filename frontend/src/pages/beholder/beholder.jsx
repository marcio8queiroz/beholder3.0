import FormPage from "../FormPage";

function beholder() {
    return (
        <FormPage title="Beholder">
            <ul className="nav nav-tabs" id="tabs" role="tablist">
                <li className="nav-item" role="presentation">
                    <button type="button" className="nav-link active" id="memory-tab" role="tab" data-bs-toggle="tab" data-bs-target="#memory">
                        Memory
                        </button>
                </li>
                 <li className="nav-item" role="presentation">
                    <button type="button" className="nav-link" id="brain-tab" role="tab" data-bs-toggle="tab" data-bs-target="#brain">
                        Brain
                        </button>
                </li>
                 <li className="nav-item" role="presentation">
                    <button type="button" className="nav-link" id="tests-tab" role="tab" data-bs-toggle="tab" data-bs-target="#tests">
                        Tests
                        </button>
                </li>
            </ul>
            <div className="tab-content px-3 mb-3" id="tabContent">
                <div className="tab-pane fade show active" id="memory" role="tabpanel">
                    Memory
                </div>
                 <div className="tab-pane fade" id="brain" role="tabpanel">
                    Brain
                </div>
                 <div className="tab-pane fade" id="tests" role="tabpanel">
                    Tests
                </div>
            </div>
        </FormPage>
    )
}

export default beholder;