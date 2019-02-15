import React, { Component } from 'react';
import './App.css';
import {
  Container, Row, Col, Button, Input, Label, FormGroup, ListGroup, ListGroupItem
} from 'reactstrap';
import { create, read, getById, deleteFirebase } from './config/Firebase';
import swal from 'sweetalert';

class App extends Component {
  constructor() {
    super();

    this.state = {
      itemVal: '',
      list: [],
      itemId: '',
      color: "success",
      text: "Add"
    }

    this.createData = this.createData.bind(this);
  }

  createData() {
    const { itemVal, itemId } = this.state;
    let id = "";
    let obj = {};
    if (itemId == '') {
      id = Math.floor(Math.random() * 123456789);
      obj = { id: id.toString(), item: itemVal };
    }
    else{
      id = itemId;
      obj = { id: id.toString(), item: itemVal };
    }
    create(obj).then((resp)=>{
      if(resp == "Done"){
        read().then((res) => {
          this.setState({
            list: res,
            itemVal: '',
            itemId : '',
            color: "success",
            text: "Add"
          });
        });
      }
    });
    
  }

  updateData(e) {
    const id = e.target.value;
    getById(id).then((res) => {
      this.setState({
        itemVal: res.item,
        itemId: res.id,
        color: "primary",
        text: "Update"
      })
    });
  }

  deleteData(e){
    const id = e.target.value;
    deleteFirebase(id).then((response)=>{
      
      this.setState({
        list: response
      });
      
    });
  }

  componentDidMount() {
    read().then((res) => {
      this.setState({
        list: res
      });
    });
  }

  render() {
    const { list, itemVal, color, text } = this.state;
    return (
      <Container>
        <Row className="mt-2">
          <Col xs="6">
            <FormGroup>
              <Label>Item:</Label>
              <Input value={itemVal} placeholder="Item..." onChange={((e) => { this.setState({ itemVal: e.target.value }) })} />
            </FormGroup>
            <FormGroup>
              <Button onClick={this.createData} color={color}>{text}</Button>
            </FormGroup>
          </Col>
          <Col xs="6">
            <FormGroup>
              <Label>List:</Label>
              {list.length > 0 && <ListGroup>
                {list.map((elem) => {
                  return <ListGroupItem key={elem.id}>
                    <div className="d-flex justify-content-between">
                      <div>
                        <span className="justify-content-start">{elem.item}</span>
                      </div>
                      <div>
                        <Button value={elem.id} onClick={this.updateData.bind(this)} className="mr-2 justify-content-end" color="info" size="sm">Edit</Button>
                        <Button value={elem.id} onClick={this.deleteData.bind(this)} className="justify-content-end" color="danger" size="sm">Delete</Button>
                      </div>
                    </div>
                  </ListGroupItem>
                })}

              </ListGroup>}
              {list.length == 0 && <ListGroup>
                <ListGroupItem>
                    <div className="d-flex justify-content-between">
                      <div>
                        <span className="justify-content-start">No Data Found!</span>
                      </div>
                    </div>
                  </ListGroupItem>
              </ListGroup>
              }
            </FormGroup>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default App;
