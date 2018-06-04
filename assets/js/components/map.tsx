import * as React from "react"
import Coordinate from "../models/coordinate"

interface Props{
  initialCoordinate: Coordinate
}

interface State {
  books: Array<any>
  isLoaded: boolean
  error?: any
}

export default class Map extends React.Component<Props, State>{
  public constructor(props, context) {
    super(props, context)
    this.state = { books: [], isLoaded: false, error: null }
  }
  public componentDidMount() {
    fetch(`http://localhost:4000/api/books?lat=${this.props.initialCoordinate.lat}&lng=${this.props.initialCoordinate.lng}`)
      .then( res => res.json() )
      .then( 
        (result) => {
          console.table(result)
          this.setState({isLoaded: true, books: result.data})
        },
        (error) => {
          this.setState({ isLoaded: true, error})
        }
      )
  }
  public render(){
    const { error, isLoaded, books } = this.state
    if (error) {
      return( <div> Error {error.message} </div>)
    } else if (!isLoaded) {
      return( <div> Loading .... </div>)
    } else {
      return(
        <div> 
          <div className="map-info">{this.props.initialCoordinate.lat}, {this.props.initialCoordinate.lng}</div>
          <ul className="map-item">
            {books.map(book => (
              <li key={book.id}>
                {book.name} {book.author}
              </li> 
            ))}
          </ul> 
        </div>
      )
    }
  }
}