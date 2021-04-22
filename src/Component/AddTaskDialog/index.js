import React from 'react';
import { Button } from 'primereact/button';
import { Row, Col } from 'reactstrap';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';
import { Calendar } from 'primereact/calendar';
import { convertToYYYYMMDD } from '../util/commonValidations';

class AddTaskDialog extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            taskDetails: {
                id: this.props.id,
                summary: "",
                desciption: "",
                dueDate: null,
                priority: "None",
                currentState: "open",
                createdOn: convertToYYYYMMDD(new Date())
            },
            priorityList: [
                { label: 'None', value: 'None' },
                { label: 'Low', value: 'Low' },
                { label: 'Medium', value: 'Medium' },
                { label: 'High', value: 'High' },
            ],
            summaryError: "",
            descriptionError: "",
            dueDateError: "",
            disable: false
        }
    }

    componentDidMount() {
        if (this.props.dialogFor === "Edit" || this.props.dialogFor === "View") {
            const taskDetails = { ...this.state.taskDetails }
            taskDetails['id'] = this.props.selectedData.id;
            taskDetails['summary'] = this.props.selectedData.summary;
            taskDetails['priority'] = this.props.selectedData.priority;
            taskDetails['dueDate'] = new Date(this.props.selectedData.dueDate);
            taskDetails['desciption'] = this.props.selectedData.desciption;
            taskDetails['currentState'] = this.props.selectedData.currentState;
            taskDetails['createdOn'] = this.props.selectedData.createdOn;
            this.setState({ taskDetails })
        }
        if (this.props.dialogFor === "View") {
            this.setState({ disable: true })
        }

    }

    onHandleChange = (e, event) => {
        const taskDetails = { ...this.state.taskDetails };
        taskDetails[event] = e.target.value;
        this.setState({ taskDetails })
        if (event === "summary") {
            this.setState({ summaryError: "" })
        } else if (event === "desciption") {
            this.setState({ descriptionError: "" })
        } else if (event === "dueDate") {
            this.setState({ dueDateError: "" })
        }
    }

    onHide = () => {
        this.props.toggle()
    }

    onSave = () => {
        if (this.onValidate()) {
            const taskDetails = { ...this.state.taskDetails }
            taskDetails['dueDate'] = convertToYYYYMMDD(taskDetails['dueDate'])
            this.props.onSave(taskDetails, this.props.dialogFor)
            this.onHide()
        }

    }

    onValidate = () => {
        let flag = true
        if (!this.state.taskDetails.summary) {
            this.setState({ summaryError: "Please enter Summary" })
            flag = false
        } else if (this.state.taskDetails.summary.length > 140 || this.state.taskDetails.summary.length < 10) {
            this.setState({ summaryError: "Summary should be minmum 10 character and maximum 140 character" })
            flag = false
        }
        if (!this.state.taskDetails.summary) {
            this.setState({ descriptionError: "Please enter Description" })
            flag = false
        } else if (this.state.taskDetails.summary.length > 500 || this.state.taskDetails.summary.length < 10) {
            this.setState({ descriptionError: "Decription should be minmum 10 character and maximum 500 character" })
            flag = false
        }
        if (!this.state.taskDetails.dueDate) {
            this.setState({ dueDateError: "Please Select Due Date" })
            flag = false
        }
        return flag
    }

    render() {
        const footer = (
            <span>
                <Button label="Cancel" onClick={this.onHide} className="p-button-secondary" />
                {!this.state.disable &&
                    <Button label="Save" onClick={this.onSave} className="p-button-success" />
                }

            </span>
        )
        return (
                <Dialog header={this.props.dialogFor + " Task"} style={{ width: '50%' }} visible={this.props.visible}
                    onHide={this.onHide} footer={footer}>
                    <Row>
                        <Col md="12">
                            <label className="control-label col-md-2" >Summary<b className="text-danger">*</b></label>
                        </Col>
                    </Row>
                    <Row>
                        <Col md="12" sm="12">
                            <InputText value={this.state.taskDetails.summary}
                                onChange={e => this.onHandleChange(e, "summary")}
                                style={{ width: "100%" }}
                                placeholder="Summary"
                                disabled={this.state.disable} />
                        </Col>
                        <Col md="12" sm="12">
                            <p className="text-danger">{this.state.summaryError}</p>
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col md="12">
                            <label className="control-label col-md-2" >Description<b className="text-danger">*</b></label>
                        </Col>
                    </Row>
                    <Row>
                        <Col md="12" sm="12">
                            <InputTextarea rows={4} style={{ width: "100%" }}
                                value={this.state.taskDetails.desciption}
                                onChange={e => this.onHandleChange(e, "desciption")}
                                placeholder="Desciption"
                                disabled={this.state.disable} />
                        </Col>
                        <Col md="12" sm="12">
                            <p className="text-danger">{this.state.descriptionError}</p>
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <label className="control-label col-md-6" >Due Date<b className="text-danger">*</b></label>
                        <label className="control-label col-md-6" >Priority<b className="text-danger">*</b></label>
                    </Row>
                    <Row>
                        <Col md="6" sm="6">
                            <Calendar value={this.state.taskDetails.dueDate}
                                onChange={(e) => this.onHandleChange(e, "dueDate")}
                                showIcon
                                minDate={new Date()}
                                disabled={this.state.disable}
                            />
                        </Col>
                        <Col md="6" sm="6">
                            <Dropdown value={this.state.taskDetails.priority}
                                options={this.state.priorityList}
                                onChange={e => this.onHandleChange(e, "priority")}
                                style={{ width: "100%" }}
                                disabled={this.state.disable}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col md="6" sm="6">
                            <p className="text-danger">{this.state.dueDateError}</p>
                        </Col>
                    </Row>
                </Dialog>
        )
    }
}
export default AddTaskDialog;