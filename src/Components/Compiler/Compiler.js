import React, { Component } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar } from 'react-bootstrap';
import "./Compiler.css";
export default class Compiler extends Component {
    constructor(props) {
        super(props);
        this.state = {
            input: localStorage.getItem('input') || ``,
            output: ``,
            language_id: localStorage.getItem('language_Id') || 2,
            user_input: ``,
        };
    }
    input = (event) => {

        event.preventDefault();

        this.setState({ input: event.target.value });
        localStorage.setItem('input', event.target.value)

    };
    userInput = (event) => {
        event.preventDefault();
        this.setState({ user_input: event.target.value });
    };
    language = (event) => {

        event.preventDefault();

        this.setState({ language_id: event.target.value });
        localStorage.setItem('language_Id', event.target.value)

    };

    submit = async (e) => {
        e.preventDefault();

        let outputText = document.getElementById("output");
        outputText.innerHTML = "";
        outputText.innerHTML += "Creating Submission ...\n";
        const response = await fetch(
            "https://judge0.p.rapidapi.com/submissions",
            {
                method: "POST",
                headers: {
                    "x-rapidapi-host": "judge0.p.rapidapi.com",
                    "x-rapidapi-key": "20b9671e5amshf01376d4ae69405p1eb2d3jsn5e2231cecb58", // Get yours for free at https://rapidapi.com/hermanzdosilovic/api/judge0
                    "content-type": "application/json",
                    accept: "application/json",
                },
                body: JSON.stringify({
                    source_code: this.state.input,
                    stdin: this.state.user_input,
                    language_id: this.state.language_id,
                }),
            }
        );
        outputText.innerHTML += "Submission Created ...\n";
        const jsonResponse = await response.json();

        let jsonGetSolution = {
            status: { description: "Queue" },
            stderr: null,
            compile_output: null,
        };

        while (
            jsonGetSolution.status.description !== "Accepted" &&
            jsonGetSolution.stderr == null &&
            jsonGetSolution.compile_output == null
        ) {
            outputText.innerHTML = `Creating Submission ... \nSubmission Created ...\nChecking Submission Status\nstatus : ${jsonGetSolution.status.description}`;
            if (jsonResponse.token) {
                let url = `https://judge0-extra.p.rapidapi.com/submissions/${jsonResponse.token}?base64_encoded=true`;

                const getSolution = await fetch(url, {
                    method: "GET",
                    headers: {
                        "x-rapidapi-host": "judge0.p.rapidapi.com",
                        "x-rapidapi-key": "20b9671e5amshf01376d4ae69405p1eb2d3jsn5e2231cecb58", // Get yours for free at https://rapidapi.com/hermanzdosilovic/api/judge0
                        "content-type": "application/json",
                    },
                });

                jsonGetSolution = await getSolution.json();
            }
        }
        if (jsonGetSolution.stdout) {
            const output = atob(jsonGetSolution.stdout);

            outputText.innerHTML = "";

            outputText.innerHTML += `Results :\n${output}\nExecution Time : ${jsonGetSolution.time} Secs\nMemory used : ${jsonGetSolution.memory} bytes`;
        } else if (jsonGetSolution.stderr) {
            const error = atob(jsonGetSolution.stderr);

            outputText.innerHTML = "";

            outputText.innerHTML += `\n Error :${error}`;
        } else {
            const compilation_error = atob(jsonGetSolution.compile_output);

            outputText.innerHTML = "";

            outputText.innerHTML += `\n Error :${compilation_error}`;
        }
    };
    render() {

        return (
            <>
                <Navbar bg="primary" variant="dark" expand="lg">
                    <Navbar.Brand href="#home">Online Compiler</Navbar.Brand>
                </Navbar>

                <div className="row container-fluid">
                    <div className="col-6 ml-4 ">
                        <label for="solution ">
                            <span className="badge badge-info heading mt-2 ">
                                <i className="fas fa-code fa-fw fa-lg" size="3"></i>&nbsp;<font size="3">Code Here</font>
                            </span>
                        </label>
                        <textarea
                            spellcheck="false"
                            required
                            name="solution"
                            id="source"
                            onChange={this.input}
                            className=" source"
                            value={this.state.input}
                        ></textarea>

                        <button
                            type="submit"
                            className="btn btn-danger ml-2 mr-2 "
                            onClick={this.submit}
                        >
                            <i class="fas fa-cog fa-fw"></i> Compile and Run
                        </button>

                        <label for="tags" className="mr-1">
                            <b className="heading">Language:</b>
                        </label>
                        <select
                            value={this.state.language_id}
                            onChange={this.language}
                            id="tags"
                            className="form-control form-inline mb-2 language"
                        >
                            <option value="54">C++</option>
                            <option value="76">C</option>
                            <option value="62">Java</option>
                            <option value="71">Python</option>
                            <option value="63">Javascript</option>
                            <option value="68">PHP</option>
                        </select>
                    </div>
                    <div className="col-5">
                        <div>
                            <span className="badge badge-info heading my-2 ">
                                <i className="fas fa-exclamation fa-fw fa-md"></i><font size="3">Output</font>
                            </span>
                            <textarea id="output"></textarea>
                        </div>
                    </div>
                </div>

                <div className="mt-2 ml-5">
                    <span className="badge badge-primary heading my-2 ">
                        <i className="fas fa-user fa-fw fa-md"></i><font size="3">User Input </font>
                    </span>
                    <br />
                    <textarea id="input" onChange={this.userInput}></textarea>
                </div>
            </>
        );
    }
}
