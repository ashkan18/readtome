import * as React from "react"

interface Props {
  searchMethod: (term) => void
}
export default class Search extends React.Component<Props, {}>{
  public render(){
    return(
      <input type="text" placeholder="Search" onChange={this.props.searchMethod}/>
    )
  }
}