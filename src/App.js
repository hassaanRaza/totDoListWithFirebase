import React, { Component } from 'react';
import './App.css';
import {
  Container, Row, Col, Button, Input, Label, FormGroup, ListGroup, ListGroupItem
} from 'reactstrap';
import { create, read, getById, deleteFirebase, db } from './config/Firebase';
import swal from 'sweetalert';

class App extends Component {
  constructor() {
    super();

    this.state = {
      itemVal: '',
      list: [],
      itemId: '',
      color: "success",
      text: "Add",
    }

    this.createData = this.createData.bind(this);
    this.cancelData = this.cancelData.bind(this);
  }

  cancelData(){
    this.setState({
      itemId : '',
      itemVal: '',
      color: "success",
      text: "Add",
    })
  }

  createData(e) {
    e.preventDefault();
    const { itemVal, itemId } = this.state;
    let id = "";
    let obj = {};
    if (itemVal != '') {
      if (itemId == '') {
        id = Math.floor(Math.random() * 123456789);
        obj = { id: id.toString(), item: itemVal, createdAt: Date.now() };
      }
      else {
        id = itemId;
        obj = { id: id.toString(), item: itemVal };
      }
      create(obj).then((resp) => {
        if (resp == "Done") {
          // read().then((res) => {
          //   this.setState({
          //     list: res,
          //     itemVal: '',
          //     itemId: '',
          //     color: "success",
          //     text: "Add"
          //   });
          // });
        }
      });
    }
    else {
      swal("Error", "Item field is required!", "error");
    }


  }

  updateData(e) {
    const id = e.target.value;
    const {list} = this.state;
    const obj = list.find((item)=>item.id == id);
    //getById(id).then((res) => {
      this.setState({
        itemVal: obj.item,
        itemId: obj.id,
        color: "primary",
        text: "Update"
      })
    //});
  }

  deleteData(e) {
    const id = e.target.value;
    deleteFirebase(id).then((response) => {

      // this.setState({
      //   list: response
      // });

    });
  }

  async readNew(){
    const {list} = this.state;
    var arr = [];
    db.collection("myList")
    .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change)=> {
            if (change.type === "added") {
                //console.log("New city: ", change.doc.data());
                arr.push(change.doc.data());
            }
            if (change.type === "modified") {
                arr = arr.map(item => {
                  if(item.id === change.doc.id){
                    return {id: change.doc.id, ...change.doc.data()}
                  }
                  return item;
                })
                //console.log("Modified city: ", change.doc.data());
            }
            if (change.type === "removed") {
                //console.log("Removed city: ", change.doc.data());
                arr = arr.filter(item => item.id != change.doc.id)
            }
        });
        const arrSorted = arr.sort((a,b)=>{
          return a.createdAt - b.createdAt;
        })
        this.setState({list:arrSorted, itemVal: '',
        itemId: '',
        color: "success",
        text: "Add"});
    });
  }

  componentDidMount() {
    // read().then((res) => {
    //   this.setState({
    //     list: res
    //   });
    // });
    this.readNew();
  }

  render() {
    const { list, itemVal, color, text, itemId } = this.state;
    return (
      <Container>
        <Row className="mt-2">
          <Col xs="12" className="d-flex justify-content-center">
            <h2>ToDo List</h2>
          </Col>
        </Row>
        <Row className="mt-2">
          <Col md="6">
          <form>
            <FormGroup>
              <Label>Item:</Label>
              <Input value={itemVal} placeholder="Item..." onChange={((e) => { this.setState({ itemVal: e.target.value }) })} />
            </FormGroup>
            <FormGroup>
              {text == "Add" ? <input type="submit" onClick={this.createData} className="btn btn-success" color={color} value="Add" /> :
              <input type="submit" onClick={this.createData} className="btn btn-primary" value="Update" />
            }
              
            </FormGroup>
            </form>
          </Col>
          <Col md="6">
            <FormGroup>
              <Label>List:</Label>
              {list.length > 0 ?
                <ListGroup>
                  {list.map((elem) => {
                    let divStyle = {};
                    {itemId === elem.id ?
                      divStyle = {
                        backgroundColor: '#dddddd',

                      }
                      :
                      divStyle = {
                        backgroundColor: '',
                      }
                    }
                    
                    return <ListGroupItem style={divStyle} key={elem.id}>
                      <div className="d-flex justify-content-between">
                        <div>
                          <span className="justify-content-start">{elem.item}</span>
                        </div>
                        <div>
                          {itemId === elem.id ?
                            <Button value={elem.id} onClick={this.cancelData.bind(this)} className="mr-2 justify-content-end" color="secondary" size="sm">Cancel</Button>
                            :
                            <Button value={elem.id} onClick={this.updateData.bind(this)} className="mr-2 justify-content-end" color="info" size="sm">Edit</Button>
                          }
                          
                          
                          <Button value={elem.id} onClick={this.deleteData.bind(this)} className="justify-content-end" color="danger" size="sm">Delete</Button>
                        </div>
                      </div>
                    </ListGroupItem>
                  })}
                </ListGroup>
                :
                <ListGroup>
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
