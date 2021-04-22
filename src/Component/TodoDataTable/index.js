import React from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { TabView, TabPanel } from 'primereact/tabview';
import { Row, Col } from 'reactstrap';
import AddTaskDialog from '../AddTaskDialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import './index.css';

class TodoDataTable extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            groupByList: [
                { label: 'None', value: 'none' },
                { label: 'Created On', value: 'createdOn' },
                { label: 'Pending On', value: 'dueDate' },
                { label: 'Priority', value: 'priority' },
            ],
            groupBy: "none",
            search: "",
            activeIndex: 0,
            selectedData: "",
            showPopup: false,
            dialogFor: "",
            showDelete: false,
            deleteData: ""
        }
    }

    onGroupSelect = (e) => {
        this.setState({ groupBy: e.target.value })
    }


    footerTemplate = (data) => {
        return (
            <React.Fragment>

            </React.Fragment>
        );
    }

    commonDataTable = (data) => {
        return (
            this.state.groupBy !== "none" ?
                <DataTable value={data}
                    rowClassName={this.markAsDone}
                    onRowClick={e => this.onRowClick(e.data)}
                    rowGroupMode="subheader" groupField={this.state.groupBy}
                    sortMode="single" sortField={this.state.groupBy} sortOrder={1}
                    rowGroupHeaderTemplate={this.headerTemplate} rowGroupFooterTemplate={this.footerTemplate}
                    ref={(el) => this.dt = el}
                >
                    <Column field="summary" header="Summary" />
                    <Column field="priority" header="Priority" />
                    <Column field="createdOn" header="Created On" />
                    <Column field="dueDate" header="Due By" />
                    <Column header="Action" body={this.action} />
                </DataTable> :
                <DataTable value={data}
                    rowClassName={this.markAsDone}
                    onRowClick={e => this.onRowClick(e.data)}
                    ref={(el) => this.dt = el}
                >
                    <Column field="summary" header="Summary" sortable />
                    <Column field="priority" header="Priority" sortable />
                    <Column field="createdOn" header="Created On" sortable />
                    <Column field="dueDate" header="Due By" sortable />
                    <Column header="Action" body={this.action} />
                </DataTable>)
    }

    headerTemplate = (data) => {
        return <span className="subHeaderClass">{data[this.state.groupBy]}</span>
    }


    onRowClick = (e) => {
        this.setState({ selectedData: e, dialogFor: "View" })

        this.togglePopup()
    }

    markAsDone = (e) => {
        if (this.state.activeIndex === 0) {
            return { 'taskDone': e.currentState === "Done" }
        }

    }

    action = (rowData) => {
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button icon="pi pi-pencil" title="Edit Task" onClick={e => { e.stopPropagation(); this.onClickEdit(rowData) }} className=" p-button-info" />
                {rowData.currentState === "Done" ?
                    <Button label="ReOpen" onClick={e => { e.stopPropagation(); this.onClickReopen(rowData.id) }} className=" p-button-success " />
                    : <Button label="Done" onClick={e => { e.stopPropagation(); this.onClickDone(rowData.id) }} className=" p-button-success " />
                }
                <Button icon="pi pi-ban" title="Delete Task" onClick={e => { e.stopPropagation(); this.onClickDelete(rowData) }} className="p-button-danger" />
            </div>
        )
    }

    onClickDone = (id) => {
        this.props.markAsDone(id)
    }

    onClickReopen = (id) => {
        this.props.reOpen(id)
    }

    onClickDelete = (rowData) => {
        this.setState({ deleteData: rowData }, this.toggleDelete)
    }

    toggleDelete = () => {
        this.setState({ showDelete: !this.state.showDelete })
    }

    onClickEdit = (rowData) => {

        this.setState({ selectedData: rowData, dialogFor: "Edit" })
        this.togglePopup()
    }

    togglePopup = () => {
        this.setState({ showPopup: !this.state.showPopup })
    }

    onSave = (taskDetail, type) => {
        this.props.onSave(taskDetail, type)
    }

    onSearchChange = (e) => {
        this.setState({ search: e.target.value })
        this.dt.filter(e.target.value, 'summary', 'startsWith')
    }


    render() {
        const footer = (
            <span>
                <Button label="No" onClick={this.toggleDelete} className="p-button-secondary" />
                <Button label="Yes" onClick={e=>{this.props.deleteTask(this.state.deleteData.id,this.state.deleteData.currentState);this.toggleDelete()}} className="p-button-danger" />

            </span>
        )
        return (
            <div>
                <Row>
                    <label className="control-label col-md-2" style={{ paddingLeft: "1.5%" }}>Group By</label>
                    <label className="control-label col-md-10" style={{ paddingLeft: "2%" }}>Search</label>
                </Row>
                <Row>
                    <Col md="2" sm="2">
                        <Dropdown value={this.state.groupBy}
                            options={this.state.groupByList}
                            onChange={e => this.onGroupSelect(e)}
                            style={{ width: "100%" }}
                        />
                    </Col>
                    <Col md="8" sm="8">
                        <InputText value={this.state.search}
                            onChange={e => this.onSearchChange(e)}
                            style={{ width: "100%" }}
                            placeholder="Search Task" />
                    </Col>
                </Row>
                <br />
                <Row>
                    <TabView header="ToDo List" activeIndex={this.state.activeIndex} onTabChange={e => this.setState({ activeIndex: e.index })} >
                        <TabPanel header="All">
                            {this.commonDataTable(this.props.pendingTaskDetails.concat(this.props.completedTaskDetails))}
                        </TabPanel>
                        <TabPanel header="Pending">
                            {this.commonDataTable(this.props.pendingTaskDetails)}
                        </TabPanel>
                        <TabPanel header="Completed">
                            {this.commonDataTable(this.props.completedTaskDetails)}
                        </TabPanel>
                    </TabView>
                </Row>
                {this.state.showDelete &&
                    <Dialog header="Confirm" style={{ width: '40%' }} visible={this.state.showDelete}
                        onHide={this.toggleDelete} footer={footer}>
                            <div style={{marginBottom:'1rem'}}><b>Summary:</b> {this.state.deleteData.summary}</div>
                             
                            <div>Do you want to delete this task?</div>

                    </Dialog>
                }
                {this.state.showPopup &&
                    <AddTaskDialog visible={this.state.showPopup}
                        toggle={this.togglePopup}
                        dialogFor={this.state.dialogFor}
                        selectedData={this.state.selectedData}
                        onSave={this.onSave}
                    />
                }
            </div>
        )
    }
}
export default TodoDataTable;