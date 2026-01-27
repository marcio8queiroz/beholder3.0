import NewOrderButton from "../Orders/NewOrderButton"
import TemplatePage from "../TemplatePage"
import CandleChart from "./CandleChart"

function Dashboard() {
  return (
    <TemplatePage>
      <div className="d-flex justify-content-between flex-wrap align-items-center py-4">
        <div className="d-block mb-0">
          <h1 className="h4">Dashboard</h1>
        </div>
        <div className="btn-toolbar mb-0">
         <NewOrderButton/>
        </div>
      </div>
    <CandleChart />
      <div className="row">
        <div className="col-6">
          {/* market 24h */}
        </div>
        <div className="col-6">
          {/* carteira */}
        </div>
      </div>
    </TemplatePage>
  )
}

export default Dashboard
