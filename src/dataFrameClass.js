//Class for dataFrame called callInfo
class callInfo {
  set Date(Date) {
    this.date = Date; //set function usage Object.assign(dataFrame.Date = somedate);
  }
  set Time(Time) {
    this.time = Time;
  }
  set Lat(Lat) {
    this.lat = Lat;
  }
  set Lon(Lon) {
    this.lon = Lon;
  }
  set Base(Base) {
    this.base = Base;
  }
  set Address(Address){
    this.address = Address;
  }
  set Street(Street){
    this.street = Street;
  }
  get Street(){
    return this.street;
  }
  set House(House){
    this.houseNum = House;
  }
  get House(){
    return this.houseNum;
  }
  

  set Zip(Zip) {
    this.zip = Zip;
  }
  set City(City) {
    this.city = City;
  }
  set State(State) {
    this.state = State;
  }
  set Locality(Locality) {
    this.locality = Locality;
  }
  set AMPM(AMPM){
    this.ampm = AMPM
  }

  get Date() { //get function usage callInfo.Date
    return this.date;
  }
  get Time() {
    return this.time;
  }
  get Lat() {
    return this.lat;
  }
  get Lon() {
    return this.lon;
  }
  get Base() {
    return this.base;
  }
  get Zip() {
    return this.zip;
  }
  get City() {
    return this.city;
  }
  get State() {
    return this.state;
  }
  get Locality() {
    return this.locality;
  }
  get Address(){
    return this.address;
  }
  get AMPM(){
    return this.ampm
  }

  constructor() {

  }
}

module.exports = callInfo;