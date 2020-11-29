import * as React from "react"
import { Popup, Header as UIHeader, Icon} from "semantic-ui-react";
import Reader from "../models/reader";
import UserService from "../services/user_service";
import styled from "styled-components";
import { Profile } from "./profile";
import { BookSubmission } from "./book_submit";

interface Props {
  me: Reader | null
  userService: UserService
  currentLocation?: any
}


const HeaderDiv = styled.div`
  padding: 10px;
  display: flex;
  flex-shrink: 1;
  width: 100%;
  flex-direction: row;
  align-self: flex-start;
  justify-content: space-between;
  border-bottom: 2px solid orange;
`

const LogoSection = styled.div`
  align-self: flex-start;
`


export const Header = (props: Props) => {
  
    return(
      <HeaderDiv>
        <LogoSection>
          <h2>R<span style={{fontSize: 10 }}>ead</span>T<span style={{fontSize: 11 }}>o</span>M<span style={{fontSize: 11 }}>e</span></h2>
        </LogoSection>
        
        { props.me &&
        <>
        
          <Popup trigger={<Icon name="plus square outline" size="large" style={{cursor: "pointer"}}/>}
            header="Add New Book"
            content={
              <BookSubmission currentLocation={props.currentLocation}/>
            }
            position="top center"
            on="click" />
          <Profile me={props.me} userService={props.userService} />
        </>
        }
      </HeaderDiv>
    )
}