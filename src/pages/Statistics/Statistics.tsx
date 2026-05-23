import "./Statistics.scss";
import Dashboard from "../../layouts/Dashboard";
import BarChartComponent from "../../components/Charts/BarChartComponent";
import PieChartComponent from "../../components/Charts/PieChartComponent";
import TitleDropdown from "../../components/Charts/TitleDropdown";
const Statistics = () => {
  return (
    <Dashboard>
      <div className="dashboard">
        <div className="top">
          <div className="chart-container">
            <TitleDropdown className="dashboardTitle" title="Dërgesat" />
            <BarChartComponent />
          </div>
          <div className="chart-container">
            <TitleDropdown title="Lokacionet e Porosive" />
            <PieChartComponent />
          </div>
        </div>
      </div>
    </Dashboard>
  );
};

export default Statistics;
