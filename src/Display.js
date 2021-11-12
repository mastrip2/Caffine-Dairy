import React from "react"

class Display extends React.Component{
  constructor (props) {
      super(props)

      this.state = {
        todayCal : 0,
        maxDailyCal:500
      }
      this.lifetimeCalCount = this.lifetimeCalCount.bind(this)
      this.TodayCalCount = this.TodayCalCount.bind(this)
      this.coffeePerc = this.coffeePerc.bind(this)
      this.HowManyMore = this.HowManyMore.bind(this)
  }

  render(){
    const styleGraph={
                        height: this.coffeePerc(this.state.todayCal)+'%',
                        backgroundColor: (this.coffeePerc(this.state.todayCal) > 90 ? 'red' : 'green')
                    }

    return (
      <div className="col-4 stats">
          <h4 className="text-center font-italic">Coffee Consumption Stats</h4>
          <div className="graph">
              <div id="fill" style={styleGraph}></div>
          </div>
          <div id="cons-disclaimer" className="font-italic font-weight-lighter">*today's consumption</div>
          <div className="chart">
            <div className="p-4">
              {this.lifetimeCalCount()}
              {this.TodayCalCount()}
            </div>
            {this.HowManyMore()}
          </div>
      </div>
    )
  }

  //Returns life time count of calories consumed
  lifetimeCalCount(){
    let count = 0

    if (Object.keys(this.props.drinkData).length !== 0) {
      this.props.drinkData.forEach(el => {
        count += parseInt(el.cal)
      })
    }

    return (
      <div id="lifetime" className="row">
          <div className="col-6">Lifetime:</div>
          <div className="col-6">{count} calories</div>
      </div>
    )
  }

  //Return Today's count of calories
  TodayCalCount(){
    let count = 0

    if (Object.keys(this.props.drinkData).length !== 0) {
      this.props.drinkData.forEach(el => {
        if(isToday(el.date))
          count += parseInt(el.cal)
      })
    }

    if(this.state.todayCal !== count){
      this.setState({
        todayCal : count
      })
    }
    
    return (
      <div id="today" className="row">
        <div className="col-6">Today:</div>
        <div className="col-6">{count} calories</div>
      </div>
    )
  }

  //Calculate percentage
  coffeePerc(num){
    return (num / this.state.maxDailyCal) * 100
  }

  //Give you a picture of how many more of each drink you can drink without over caffeinating
  HowManyMore(){
    const choices = this.props.drinkChart.map(op =>{
                          return (
                                    <div key = {op.id} className="col-12">
                                      <div className="row">
                                        <div className="col-6">{op.name}</div>
                                        <div className="col-6">{Math.floor((this.state.maxDailyCal - this.state.todayCal) / op.cal)} / {Math.floor(this.state.maxDailyCal / op.cal)}</div>
                                      </div>
                                    </div>
                              )
                        })
    return (
              <div className="row how-many-more bg-light rounded p-4">
                <h6>How many more can I have (today)?</h6>
                {choices}
              </div>
          )
  }
}

//Determine if the given date is today
function isToday(date){
  let t = new Date(date.replace(/-/g, '\/'))  
  const today = new Date()

  return t.getDate() === today.getDate() &&
    t.getMonth() === today.getMonth() &&
    t.getFullYear() === today.getFullYear()
}

export default Display