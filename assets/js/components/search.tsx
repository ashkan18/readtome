import * as React from "react"
import {Input} from "semantic-ui-react"

interface Props {
  searchMethod: (term: string | null) => void
}

function debounce(a,b,c) {var d,e;return function(){function h(){d=null,c||(e=a.apply(f,g))}var f=this,g=arguments;return clearTimeout(d),d=setTimeout(h,b),c&&!d&&(e=a.apply(f,g)),e}}


export default class Search extends React.Component<Props, {}>{

  componentWillMount() {
    this.search = debounce(this.search, 500, false)
  }
  public render(){
    return(
      <Input fluid
        icon='search'
        onChange={ (_event, {value}) => this.search(value) }/>
    )
  }

  private search(value: string){
    if (value.length > 3){
      this.props.searchMethod(value)
    }
  }
}