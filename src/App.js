import React, { useState, useEffect } from "react";
import List from "./components/List";
import "./App.css";
import Alert from "./components/Alert";

const getLocalStorage = () => {
  let list = localStorage.getItem('list');
  if (list){
    return JSON.parse(localStorage.getItem('list'))
  }
  else {
    return []
  }
}

const App = () => {
  const [name, setName] = useState("");
  const [list, setList] = useState(getLocalStorage());
  const [isEditing, setIsEditing] = useState(false);
  const [editID, setEditID] = useState(null);
  const [alert, setAlert] = useState({ show: false, msg: "", type: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) {
      //display alert
      showAlert(true, "danger", 'please enter value')
      setAlert({show:true, msg: 'please enter value', type: 'danger'})
    } else if (name && isEditing) {
      setList(list.map((item) => {
        if (item.id === editID) {
          return{...item, title: name}
        }
        return item
      }))
      setName("");
      setEditID(null);
      setIsEditing(false);
      showAlert(true, 'success', 'value changed')
    } else {
      showAlert(true, 'success', 'item added to the list')
      const newItem = { id: new Date().getTime().toString(), title: name };
      setList([...list, newItem]);
      setName("");
    }
  };

  const showAlert = (show=false, type="", msg="") => {
    setAlert({show, type, msg}) 
  }

  const clearList = () => {
    showAlert(true, 'danger', 'empty list')
    setList([])
  }

  const removeItem = (id) => {
    showAlert(true, 'danger', 'item removed')
    setList(list.filter((item) => item.id !== id))
  }

  const editItem = (id) => {
    const specificItem = list.find((item) => item.id === id);
    setIsEditing(true);
    setEditID(id)
    setName(specificItem.title)
  }

  useEffect(() => {
    localStorage.setItem('list', JSON.stringify(list))
  }, [list])

  return (
    <>
      <section className="section-center">
        <div class="content">
          <form className="form" onSubmit={handleSubmit}>
            {alert.show && <Alert {...alert} removeAlert={showAlert} list={list}/>}
            <h3>My Todo List</h3>
            <div className="form-control">
              <input
                type="text"
                placeholder="Add your item"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <button type="submit" className="submit-btn">
                {isEditing ? "edit" : "Add"}
              </button>
            </div>
            {list.length > 0 && (
              <div className="container">
                <List items={list} removeItem={removeItem} editItem={editItem}/>
                <button className="clear-btn" onClick={clearList}>Clear Items</button>
              </div>
            )}
          </form>
        </div>
      </section>
    </>
  );
};

export default App;
