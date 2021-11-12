import React from "react"
import Display from "./Display"

class Data extends React.Component{
  
  constructor (props) {
    super(props)

    this.state = {
      loading: false,
      drinkData : {},
      drinkChart : [],
      drinkPick : 1,
      dateField : new Date().toISOString().slice(0, 10)
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.MakeForm = this.MakeForm.bind(this)
    this.DrinkChartDisplay = this.DrinkChartDisplay.bind(this)
}

handleChange(e){
  this.setState({dateField: e.target.value})
}

//Remove Drink from list
handleDelete(id) {
  //update local data
  const newDrinkData = this.state.drinkData.filter(item => {
    if(item.id !== id)
      return true
  })
  this.setState({drinkData : newDrinkData})

  //Delete drink record from database
  fetch('https://ccrazy.exofire.net/job/api/deleteDrinkData.php', {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
    body: new URLSearchParams({data: parseInt(id)})
  })
  .then(response => response.json())
  .then(data => {console.log(data)})
  .catch((error) => console.log(error))
}

//Handle transfering the value that a user picked to the form element
handleDrinkPick(id){
  this.setState({drinkPick : id})
}

//Handle drink submitted selection from form
handleSubmit(e){
    e.preventDefault();//prevent form default behavior

    //Set some default form values
    let id = (this.state.drinkData.length > 0 ? parseInt(this.state.drinkData[0].id) + 1 : 0)
    const formD = {
      id : id,
      drink : "",
      cal : 0,
      date : new Date().toISOString().slice(0, 10)
    }

    const found = this.state.drinkChart.find(({ id }) => id === e.target.drink.value)

    formD.drink = found.name
    formD.cal = found.cal
    formD.date = e.target.date.value

    this.setState(prevState => ({
        drinkData: [ 
            formD,
            ...prevState.drinkData
        ]
    }))

    //Add drink record from database
    fetch('https://ccrazy.exofire.net/job/api/addDrinkData.php', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
      body: new URLSearchParams(formD)
    })
      .then(response => response.json())
      .then(data => {console.log(data)})
      .catch((error) => console.log(error))
 }

MakeForm(prop) {
  const options = this.state.drinkChart.map(op =>{
    return (
            <div key = {op} className={`${this.state.drinkPick === op.id ? "selected" : ""} col-4 item`} onClick={() => this.handleDrinkPick(op.id)}>
              <img src={op.image} alt={op.name} data-attr={op.id}/>
              <div className="item-name">{op.name} <span className="cal-count">- {op.cal} cal</span></div>
            </div>
          )
  })
  
  return (
      <form onSubmit={prop.handleSubmit}>
        <div className="row" style={{marginBottom:25}}>
          <div className="col-1">
            <span className="number-circle rounded-circle">1</span>
          </div>
          <div className="col-11">
            <label className="font-weight-bold">Select your drink</label>
            <div className="row drink-choice">{options}</div>
            <input type="hidden" name="drink" value={this.state.drinkPick} />
          </div>
        </div>

        <div className="row">
            <div className="col-1">
              <span className="number-circle rounded-circle">2</span>
            </div>
            <div className="col-11">
              <label className="font-weight-bold">What date did you drink this? </label><br />
                <input 
                    type="date" 
                    value={this.state.dateField} 
                    name="date"
                    onChange={this.handleChange}
                />
            </div>
        </div>
         <div className="row">
           <div className="col-12 text-center">
              <button className="btn btn-success btn-large">Submit</button>
           </div>
          </div>
          
      </form>
  )
}

Header(){
  return (
    <header className="blog-header">
    <div className="row flex-nowrap justify-content-between align-items-center">
      <div className="col-12 text-center logo">
        My Coffee Dairy
      </div>
    </div>
  </header>
  )
}

componentDidMount() {
    //Retieve type of drinks to choose from
    fetch("https://ccrazy.exofire.net/job/api/getDrinks.php")
        .then(response => response.json())
        .then(data => {
          this.setState({
            drinkChart : data
          })
        })
      
    //Retrieve latest drink records
    fetch("https://ccrazy.exofire.net/job/api/getDrinkData.php")
        .then(response => response.json())
        .then(data => {
          this.setState({
            drinkData : (data ? data : [])
          })
        })
        .catch((error) => console.log(error))

    this.setState({
        loading: false
    })
}
  
  render(){
    if (!this.state.loading) {//Only render after we have data from the api
        return (
          <div className="container">
            <this.Header />
            <div className="row">
              <div className="col-8">
                <this.MakeForm handleSubmit = {this.handleSubmit}/>
              </div>
              <Display drinkData = {this.state.drinkData} drinkChart = {this.state.drinkChart}/>
            </div>
            <this.DrinkChartDisplay />
          </div>)
    }
    return <h1>Loading...</h1>
  }
  
  //Render past drink data chart
  DrinkChartDisplay(){
    if (Object.keys(this.state.drinkData).length !== 0) {
      const items = this.state.drinkData.map(item =>{
        return <Item key = {item.id} id={item.id} item ={item} handleDelete={this.handleDelete}/>
      })
    
      return (
          <div className="col-12 data">
            <h3>Past logged drinks</h3>
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead>
                  <tr className="thead-dark">
                    <th>Drink Name</th>
                    <th>Calorie</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {items}
                </tbody>
              </table>
            </div>
          </div>
        )
    }

    return (
      <div className="col-12 data">
        You do not have any drink data to display
      </div>
    )
  }
}

function Item(prop){
  return (
          <tr>
            <td>{prop.item.drink}</td>
            <td>{prop.item.cal}</td>
            <td>{prop.item.date}</td>
            <td><button onClick={() => prop.handleDelete(prop.id)} className="btn btn-secondary btn-sm">Remove</button></td>
          </tr>
    )
}

export default Data