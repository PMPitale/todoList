import React from 'react';
import { Button } from 'primereact/button';
import AddTaskDialog from '../AddTaskDialog';
import TodoDataTable from '../TodoDataTable';
import './index.css';

class Home extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            showPopup: false,
            dialogFor: "",
            //Demo Data for testing
            pendingTaskDetails: [{
                id: 1,
                summary: "Purchase NoteBook",
                desciption: "Purchase NoteBook from Market",
                dueDate: "2021-04-30",
                priority: "Low",
                currentState: "open",
                createdOn: "2021-04-22"
            },
            {
                id: 2,
                summary: "Buy Groceries",
                desciption: "Buy Groceries from Market",
                dueDate: "2021-04-30",
                priority: "Medium",
                currentState: "open",
                createdOn: "2021-04-22"
            },
            {
                id: 4,
                summary: "Prepare Presentation",
                desciption: "Prepare Presentation For Client",
                dueDate: "2021-04-24",
                priority: "High",
                currentState: "open",
                createdOn: "2021-04-22"
            }, {
                id: 5,
                summary: "Play Badminton",
                desciption: "Play Badminton on ground",
                dueDate: "2021-04-28",
                priority: "High",
                currentState: "open",
                createdOn: "2021-04-22"
            }],
            completedTaskDetails: [ {
                id: 3,
                summary: "Refil Ink Pen",
                desciption: "Refil Ink Pen",
                dueDate: "2021-04-24",
                priority: "None",
                currentState: "Done",
                createdOn: "2021-04-22"
            }],

            id: 6
        }
    }

    togglePopup = () => {
        this.setState({ showPopup: !this.state.showPopup })
    }

    onClickAdd = () => {
        this.setState({ dialogFor: "Add" })
        this.togglePopup()
    }

    onSave = (taskDetail, type) => {
        let pendingTaskDetails = [...this.state.pendingTaskDetails]
        let completedTaskDetails = [...this.state.completedTaskDetails]
        if (type === "Add") {
            this.setState({ id: taskDetail.id + 1 })
            pendingTaskDetails.unshift(taskDetail)
            this.setState({ pendingTaskDetails })
        } else if (type === "Edit") {
            if (taskDetail.currentState === "Done") {
                let completedTask = []
                completedTaskDetails.map(task => {
                    if (task.id === taskDetail.id) {
                        completedTask.push(taskDetail)
                    } else {
                        completedTask.push(task)
                    }
                    return null;
                })
                this.setState({ completedTaskDetails: completedTask })
            } else {
                let pendingTask = []
                pendingTaskDetails.map(task => {
                    if (task.id === taskDetail.id) {
                        pendingTask.push(taskDetail)
                    } else {
                        pendingTask.push(task)
                    }
                    return null;
                })
                this.setState({ pendingTaskDetails: pendingTask })
            }
        }
    }

    markAsDone = (id) => {
        const pendingTaskDetails = [...this.state.pendingTaskDetails]
        const completedTaskDetails = [...this.state.completedTaskDetails]
        pendingTaskDetails.map(task => {
            if (task.id === id) {
                task['currentState'] = "Done"
                completedTaskDetails.push(task)
                this.setState({ completedTaskDetails })
            }
            return null;
        })
        this.setState({ pendingTaskDetails: pendingTaskDetails.filter((task) => task.id !== id) })
    }

    reOpen = (id) => {
        const pendingTaskDetails = [...this.state.pendingTaskDetails]
        const completedTaskDetails = [...this.state.completedTaskDetails]
        completedTaskDetails.map(task => {
            if (task.id === id) {
                task['currentState'] = "Open"
                pendingTaskDetails.push(task)
                this.setState({ pendingTaskDetails })
            }
            return null;
        })
        this.setState({ completedTaskDetails: completedTaskDetails.filter((task) => task.id !== id) })
    }

    deleteTask = (id, status) => {
        if (status === "Done") {
            const completedTaskDetails = [...this.state.completedTaskDetails]
            this.setState({ completedTaskDetails: completedTaskDetails.filter((task) => task.id !== id) })
        } else {
            const pendingTaskDetails = [...this.state.pendingTaskDetails]
            this.setState({ pendingTaskDetails: pendingTaskDetails.filter((task) => task.id !== id) })
        }
    }

    render() {
        return (
            <div>
                <Button icon="pi pi-plus" title="Add Task" onClick={this.onClickAdd} className="p-button-rounded p-button-info buttonPosition" />
                <h3>ToDo App</h3>
                <br />

                <TodoDataTable pendingTaskDetails={this.state.pendingTaskDetails}
                    completedTaskDetails={this.state.completedTaskDetails}
                    markAsDone={this.markAsDone}
                    reOpen={this.reOpen}
                    deleteTask={this.deleteTask}
                    onSave={this.onSave}
                    search={this.state.search} />

                {this.state.showPopup &&
                    <AddTaskDialog visible={this.state.showPopup}
                        toggle={this.togglePopup}
                        dialogFor={this.state.dialogFor}
                        id={this.state.id}
                        onSave={this.onSave}
                    />
                }

            </div>
        )
    }
}
export default Home;