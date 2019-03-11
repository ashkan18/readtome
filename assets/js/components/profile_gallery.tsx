import * as React from "react"
import Carousel from 'nuka-carousel'
import Reader from "../models/reader"
import {Image} from "semantic-ui-react"

interface Props {
  reader: Reader
}

interface Photo {
  thumb: string
}


export default class ProfileGallery extends React.Component<Props, {}>{
  public render(){
    const {photos} = this.props.reader
    return(
      <Carousel style={{height: 100}}
        heightMode="max"
        swiping={true}
        renderCenterLeftControls={({ previousSlide }) => (
          <button onClick={previousSlide}>{"<"}</button>
        )}
        renderCenterRightControls={({ nextSlide }) => (
          <button onClick={nextSlide}>{">"}</button>
        )}>
        {photos.map( (p: Photo) => <Image src={p.thumb} size="small"/> )}
      </Carousel>
    )
  }
}