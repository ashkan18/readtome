import * as React from "react"
import {DebounceInput} from 'react-debounce-input'

import styled from 'styled-components'

const StyledInput = styled.div`
  width: 100%;
  padding: 5px;
  input {
    width: 100%;
  }
`

interface Props {
  searchMethod: (term) => void
}


export default class Search extends React.Component<Props, {}>{
  public render(){
    return(
      <StyledInput>
        <DebounceInput minLength={3}
                      debounceTimeout={300}
                      placeholder="Search"
                      className="search-input"
                      onChange={ event => this.props.searchMethod(event.target.value) }/>
      </StyledInput>
    )
  }
}