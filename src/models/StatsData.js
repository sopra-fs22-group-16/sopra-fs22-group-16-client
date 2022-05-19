class StatsData {
  constructor(name, dataPoints) {
      this.type = "line";
      this.name = name;
      this.showInLegend =  true;
      this.dataPoints = dataPoints;
      Object.assign(this);
  }
}
export default StatsData;