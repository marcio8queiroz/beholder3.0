import TemplatePage from "../TemplatePage"

function Dashboard() {
  return (
    <TemplatePage>
      <div className="d-flex justify-content-between flex-wrap align-items-center py-4">
        <div className="d-block mb-4">
          <h1 className="h4">Dashboard</h1>
        </div>
        <div className="btn-toolbar mb-0">
          {/* select de symbols e botão de nova ordem manual */}
        </div>
      </div>
      {/* gráfico de velas*/}
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
