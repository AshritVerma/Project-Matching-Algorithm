import * as React from 'react';

import { getApiURI } from '../../../common/server';
import { HTMLTable, Button, Intent, Card } from '@blueprintjs/core';
import { Loading } from 'components/Loading';

interface IProjectListProps {
}

interface IProjectListState {
    projects: Array<{}>;
    isLoading: boolean;
    selected: boolean;
    // <Button onClick={this.toggleCheckboxes}>Select All</Button>
}

interface IProject {
    projectId: number;
    projectName: string;
    semester: string;
    statusId: number;
    minSize: string;
    maxSize: string;
    technologies: string;
    background: string;
    description: string;
}

class ProjectProposalApprovalForm extends React.Component<IProjectListProps, IProjectListState> {
    constructor(props: IProjectListProps) {
        super(props);

        this.state = {
            projects: [],
            isLoading: false,
            selected: false,
        };
        this.submitClicked = this.submitClicked.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.toggleCheckboxes = this.toggleCheckboxes.bind(this);
    }
    submitClicked(projectId: number, type: number) {
        /*var request = new XMLHttpRequest();
        request.withCredentials = true;
        request.open('POST', 'http://localhost:8080/projectApprovalAttempt/');
        request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        var data = JSON.stringify({
        projects: this.state.projects,
        });
        request.setRequestHeader('Cache-Control', 'no-cache');
        request.send(data); */

        // var request = new Request(getApiURI('/projects'));

        var request = new XMLHttpRequest();
        request.withCredentials = true;
        if (type === 1) {
            request.open('POST', 'http://localhost:8080/projects/pending/' + projectId);
        } else if (type === 2) {
            request.open('POST', 'http://localhost:8080/projects/approve/' + projectId);
        } else if (type === 3) {
            request.open('POST', 'http://localhost:8080/projects/reject/' + projectId);
        } else if (type === 4) {
            request.open('POST', 'http://localhost:8080/projects/change/' + projectId);
        }

        request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        request.setRequestHeader('Cache-Control', 'no-cache');
        request.send();
    }

    handleChange(e: any) {
        let projects = this.state.projects;
        let name = e.target.value;
        {
            projects.map((project: IProject) => {
                if (project.projectName === name && e.target.checked) {
                    project.statusId = 2;
                } else if (project.projectName === name && !e.target.checked) {
                    project.statusId = 1;
                }
            });
        }

        this.setState({
            projects: projects
        });
    }
    toggleCheckboxes() {
        if (this.state.selected === false) {
            this.setState({
                selected: true
            });
        } else {
            this.setState({
                selected: false
            });
        }
    }
    async componentDidMount() {
        this.setState({ isLoading: true });

        try {
            const response = await fetch(getApiURI('/projects'));
            const data = await response.json();

            this.setState({
                projects: data,
                isLoading: false
            });
        } catch (e) {
            console.error(e);
        }
    }

    getStatus(id: number) {
        if (id === 0 || id === 1) {
            return 'Pending Approval';
        } else if (id === 2) {
            return 'Approved';
        } else if (id === 3) {
            return 'Rejected';
        }
        return 'Changes Requested';
    }

    render() {
        const { projects, isLoading } = this.state;

        if (isLoading) {
            return <Loading />;
        }

        return (
            <div className="csci-container">
                <div className="csci-main">
                    <Card>
                        <HTMLTable bordered={true} striped={true} style={{ width: '100%' }}>
                            <thead>
                                <tr>
                                    <th>Project Name</th>
                                    <th>Project Semester</th>
                                    <th>Project Status</th>
                                    <th>Min Size</th>
                                    <th>Max Size</th>
                                    <th>Description</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {projects.map((project: IProject) =>
                                    <tr key={project.projectId}>
                                        <td>{project.projectName}</td>
                                        <td>{project.semester}</td>
                                        <td>{this.getStatus(project.statusId)}</td>
                                        <td>{project.minSize}</td>
                                        <td>{project.maxSize}</td>
                                        <td>{project.description}</td>
                                        <td>
                                            <Button intent={Intent.SUCCESS} onClick={() => this.submitClicked(project.projectId, 2)}>Approve</Button>
                                            <Button intent={Intent.DANGER} onClick={() => this.submitClicked(project.projectId, 3)}>Reject</Button>
                                            <Button intent={Intent.WARNING} onClick={() => this.submitClicked(project.projectId, 4)}>Change</Button>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </HTMLTable>
                    </Card>
                </div>
            </div >);
    }
}

export default ProjectProposalApprovalForm;
