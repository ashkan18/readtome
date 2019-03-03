import * as React from 'react';
import { Component } from 'react';
import { Button, ButtonProps, Label, Input } from 'semantic-ui-react';
import * as uuid from 'uuid';

interface ActionProps {
    onSelect?: (file: any) => void;
}

export class FileUploader extends Component<ActionProps & ButtonProps> {
    private id: string = uuid.v1();

    constructor(props: ActionProps) {
        super(props);
        this.onChangeFile = this.onChangeFile.bind(this);
    }

    public render() {
        return (
            <>
              <Label
                  as="label"
                  basic
                  htmlFor={this.id}
              >
                  <Button
                      {...this.props}
                      icon="upload"
                      htmlFor={this.id}
                      label={{
                          basic: true,
                          content: 'Select file(s)'
                      }}
                      labelPosition="right"
                  />
                  <Input
                      id={this.id}
                      multiple
                      type="file"
                      accept="image/png, image/jpeg"
                      onChange={this.onChangeFile} />
              </Label>
            </>
        );
    }

    private onChangeFile() {
        const fileButton: any = document.getElementById(this.id);
        const file = fileButton ? fileButton.files[0] : null;
        if (this.props.onSelect) {
            this.props.onSelect(file);
        }
    }
}