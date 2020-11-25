import * as React from "react"
import { Popup, Header as UIHeader} from "semantic-ui-react";
import Reader from "../models/reader";
import UserService from "../services/user_service";
import styled from "styled-components";
import { Profile } from "./profile";
import { BookSubmission } from "./book_submit";
import { PlusIcon } from "@artsy/palette/dist/svgs/PlusIcon";

interface Props {
  me: Reader | null
  userService: UserService
}

interface State{
  editProfile: boolean,
  photos: any
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
          <Popup trigger={<PlusIcon width={25} height={25}/>}
            header="Add New Book"
            content={
              <BookSubmission/>
            }
            position="top center"
            on="click" />
          <Profile me={props.me} userService={props.userService} />
        </>
        }
      </HeaderDiv>
    )
}