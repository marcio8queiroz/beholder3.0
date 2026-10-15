import { useEffect, useState } from "react";
import FormPage from "../FormPage";
import BeholderTab from "./BeholderTab";
import BeholderTest from "./BeholderTest";
import { getMemory, getBrain } from "../../services/BeholderService";


function Beholder() {

    const [memory, setMemory] = useState({});
    const [brain, setBrain] = useState({});

    useEffect(() => {
        getMemory()
            .then(memory => setMemory(memory))
            .catch(err => setMemory({ error: err.response ? err.response.data : err.message }))

        getBrain()
            .then(brain => setBrain(brain))
            .catch(err => setBrain({ error: err.response ? err.response.data : err.message }))
    }, [])

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
                    <BeholderTab id="memory" data={memory} hasSearch={true} />
                </div>
                 <div className="tab-pane fade" id="brain" role="tabpanel">
                    <BeholderTab id="brain" data={brain} hasSearch={false} />
                </div>
                 <div className="tab-pane fade" id="tests" role="tabpanel">
                    <BeholderTest data={memory} />
                </div>
            </div>
        </FormPage>
    )
}

export default Beholder;
