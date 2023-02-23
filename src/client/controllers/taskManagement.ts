import { Request, response, Response } from "express";
import { CreateTask } from "../../shared/models/CreateTask";

import Mailer from "../../shared/lib/mailer/mailer";
import { v4 as uuidv4 } from 'uuid';
 

// Add Task
export const addTask= (req: Request, res: Response) => {
    
console.log('req',req.body);


CreateTask.create({ 
        id:uuidv4(),
        done: false,
        dueDate: req.body.dueDate,
        title: req.body.title,
    })
        .then(response => {
            res.send(
                {
                    "message": "Task successfully updated",
                    "response": response
                }
            );
            const mailList = ['mona44146@outlook.com']
                                const message = "";
                                const subject = "Task created successfully";
                                const template = `<div class="" id="editorParent_1">
                                <div tabindex="0" dir="ltr" class="dFCbN k1Ttj dPKNh DziEn" role="textbox" aria-multiline="true"
                                    aria-label="Message body, press Alt+F10 to exit" contenteditable="true" style="user-select: text;"
                                    textprediction="false" spellcheck="true">
                                    <div class="elementToProof">
                                        <div class="elementToProof"
                                            style="font-family:Calibri,Helvetica,sans-serif; font-size:10pt; color:rgb(0,0,0); background-color:rgb(255,255,255)">
                                            <br></div>
                                        <div class="elementToProof"
                                            style="text-align:center; font-family:Calibri,Helvetica,sans-serif; font-size:10pt; color:rgb(0,0,0); background-color:rgb(255,255,255)">
                                            <span id="✅" style="font-size:100pt">✅</span><br></div>
                                        <div class="elementToProof"
                                            style="text-align:center; font-family:Calibri,Helvetica,sans-serif; font-size:10pt; color:rgb(0,0,0); background-color:rgb(255,255,255)">
                                            <span class="chakra-alert__title css-zvy4 ContentPasted1"
                                                style="border-width:0px; border-style:solid; box-sizing:border-box; color:rgb(45,55,72); font-family:Comic Sans MS,Chalkboard,cursive; font-size:20pt"><b>Your
                                                    task has been successfully created!</b></span><br class="ContentPasted1"></div>
                                        <div class="elementToProof"
                                            style="text-align:center; font-family:Calibri,Helvetica,sans-serif; font-size:10pt; color:rgb(0,0,0); background-color:rgb(255,255,255)">
                                            <span class="chakra-alert__desc css-xbzfl4 ContentPasted1"
                                                style="border-width:0px; border-style:solid; box-sizing:border-box; display:inline; color:rgb(45,55,72); font-family:Comic Sans MS,Chalkboard,cursive; font-size:12pt">Thanks
                                            </span><span class="chakra-alert__desc css-xbzfl4 ContentPasted1"
                                                style="border-width:0px; border-style:solid; box-sizing:border-box; display:inline; color:rgb(45,55,72); font-family:Comic Sans MS,Chalkboard,cursive; font-size:12pt">for
                                                creating a task. All the very best for your task<span id="😊">😊</span></span><br></div>
                                        <div class="elementToProof"
                                            style="font-family:Calibri,Helvetica,sans-serif; font-size:10pt; color:rgb(0,0,0); background-color:rgb(255,255,255)">
                                            <br></div>
                                        <div class="elementToProof"
                                            style="font-family:Calibri,Helvetica,sans-serif; font-size:10pt; color:rgb(0,0,0); background-color:rgb(255,255,255)">
                                            <br></div>
                                        <div class="elementToProof"
                                            style="font-family:Calibri,Helvetica,sans-serif; font-size:10pt; color:rgb(0,0,0); background-color:rgb(255,255,255)">
                                            <br></div>
                                        <div class="elementToProof"
                                            style="font-family:Calibri,Helvetica,sans-serif; font-size:10pt; color:rgb(0,0,0); background-color:rgb(255,255,255)">
                                            <br></div>
                                        <div class="elementToProof"
                                            style="font-family:Calibri,Helvetica,sans-serif; font-size:10pt; color:rgb(0,0,0); background-color:rgb(255,255,255)">
                                            <br></div>
                                        <div class="elementToProof"
                                            style="font-family:Calibri,Helvetica,sans-serif; font-size:10pt; color:rgb(0,0,0); background-color:rgb(255,255,255)">
                                            <br></div>
                                        <div class="elementToProof"
                                            style="font-family:Calibri,Helvetica,sans-serif; font-size:10pt; color:rgb(0,0,0); background-color:rgb(255,255,255)">
                                            <br></div>
                                        <div class="elementToProof"
                                            style="font-family:Calibri,Helvetica,sans-serif; font-size:10pt; color:rgb(0,0,0); background-color:rgb(255,255,255)">
                                            <br></div>
                                        <div class="elementToProof"
                                            style="font-family:Calibri,Helvetica,sans-serif; font-size:10pt; color:rgb(0,0,0); background-color:rgb(255,255,255)">
                                            <br></div>
                                        <div class="elementToProof"
                                            style="font-family:Calibri,Helvetica,sans-serif; font-size:10pt; color:rgb(0,0,0); background-color:rgb(255,255,255)">
                                            <br></div>
                                        <div class="elementToProof"
                                            style="font-family:Calibri,Helvetica,sans-serif; font-size:10pt; color:rgb(0,0,0); background-color:rgb(255,255,255)">
                                            <br></div>
                                        <div class="elementToProof"
                                            style="font-family:Calibri,Helvetica,sans-serif; font-size:10pt; color:rgb(0,0,0); background-color:rgb(255,255,255)">
                                            <br></div>
                                        <div class="elementToProof"
                                            style="font-family:Calibri,Helvetica,sans-serif; font-size:10pt; color:rgb(0,0,0); background-color:rgb(255,255,255)">
                                            <br></div>
                                        <div class="elementToProof"
                                            style="font-family:Calibri,Helvetica,sans-serif; font-size:10pt; color:rgb(0,0,0); background-color:rgb(255,255,255)">
                                            <br></div>
                                        <div class="elementToProof"
                                            style="font-family:Calibri,Helvetica,sans-serif; font-size:10pt; color:rgb(0,0,0); background-color:rgb(255,255,255)">
                                            <br></div>
                                        <div class="elementToProof"
                                            style="font-family:Calibri,Helvetica,sans-serif; font-size:10pt; color:rgb(0,0,0); background-color:rgb(255,255,255)">
                                            <br></div>
                                        <div class="elementToProof"
                                            style="font-family:Calibri,Helvetica,sans-serif; font-size:10pt; color:rgb(0,0,0); background-color:rgb(255,255,255)">
                                            <br></div>
                                        <div class="elementToProof"
                                            style="font-family:Calibri,Helvetica,sans-serif; font-size:10pt; color:rgb(0,0,0); background-color:rgb(255,255,255)">
                                            <br></div>
                                        <div class="elementToProof"
                                            style="font-family:Calibri,Helvetica,sans-serif; font-size:10pt; color:rgb(0,0,0); background-color:rgb(255,255,255)">
                                            <br></div>
                                        <div class="elementToProof"
                                            style="font-family:Calibri,Helvetica,sans-serif; font-size:10pt; color:rgb(0,0,0); background-color:rgb(255,255,255)">
                                            <br></div>
                                        <div class="elementToProof"
                                            style="font-family:Calibri,Helvetica,sans-serif; font-size:10pt; color:rgb(0,0,0); background-color:rgb(255,255,255)">
                                            <br></div>
                                        <div class="elementToProof"
                                            style="font-family:Calibri,Helvetica,sans-serif; font-size:10pt; color:rgb(0,0,0); background-color:rgb(255,255,255)">
                                            <br></div>
                                        <div class="elementToProof"
                                            style="font-family:Calibri,Helvetica,sans-serif; font-size:10pt; color:rgb(0,0,0); background-color:rgb(255,255,255)">
                                            <br></div>
                                        <div id="Signature">
                                            <div>
                                                <p
                                                    style="margin-top: 0px; margin-bottom: 0px;margin-top:0px; margin-bottom:0px; margin-top:0px; margin-bottom:0px; margin-top:0px; margin-bottom:0px; margin:0cm; font-size:11pt; font-family:Calibri,sans-serif">
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>`;

                                Mailer.sendMail(['mona44146@outlook.com'], message, subject, template).then((response) => {
                                    console.log(response);
                                }).catch((error) => {
                                    console.log(error);
                                });

        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving notes."
            });
        });
};

export const updateTask = (req: Request, res: Response) => { 
    console.log('req',req.body);
    console.log('params',req.params);

    
    CreateTask.findOneAndUpdate({ id: req.params.id }, {
        done: req.body.done,
        dueDate: req.body.dueDate,
        title: req.body.title,
    })
        .then((response) => {

            console.log('res',response);

            let template=`<div class="x_elementToProof">
            <div class="x_elementToProof"
                style="font-family:Calibri,Helvetica,sans-serif; font-size:10pt; color:rgb(0,0,0); background-color:rgb(255,255,255)">
                <br></div>
            <div class="x_elementToProof"
                style="text-align:center; font-family:Calibri,Helvetica,sans-serif; font-size:10pt; color:rgb(0,0,0); background-color:rgb(255,255,255)">
                <span id="x_✅" style="font-size:100pt">✅</span><br></div>
            <div class="x_elementToProof elementToProof"
                style="text-align:center; font-family:Calibri,Helvetica,sans-serif; font-size:10pt; color:rgb(0,0,0); background-color:rgb(255,255,255)">
                <span class="x_chakra-alert__title x_css-zvy4 x_ContentPasted1"
                    style="border-width:0px; border-style:solid; box-sizing:border-box; color:rgb(45,55,72); font-family:Comic Sans MS,Chalkboard,cursive; font-size:20pt"><b>Your
                        task has been successfully updated!</b></span><br class="x_ContentPasted1"></div>
            <div class="x_elementToProof elementToProof"
                style="text-align:center; font-family:Calibri,Helvetica,sans-serif; font-size:10pt; color:rgb(0,0,0); background-color:rgb(255,255,255)">
                <span class="x_chakra-alert__desc x_css-xbzfl4 x_ContentPasted1"
                    style="border-width:0px; border-style:solid; box-sizing:border-box; display:inline; color:rgb(45,55,72); font-family:Comic Sans MS,Chalkboard,cursive; font-size:12pt"><span
                        id="x_😊" style="font-size: 25pt;">😊</span></span><br></div>
            <div class="x_elementToProof"
                style="font-family:Calibri,Helvetica,sans-serif; font-size:10pt; color:rgb(0,0,0); background-color:rgb(255,255,255)">
                <br></div>
            <div class="x_elementToProof"
                style="font-family:Calibri,Helvetica,sans-serif; font-size:10pt; color:rgb(0,0,0); background-color:rgb(255,255,255)">
                <br></div>
            <div class="x_elementToProof"
                style="font-family:Calibri,Helvetica,sans-serif; font-size:10pt; color:rgb(0,0,0); background-color:rgb(255,255,255)">
                <br></div>
            <div class="x_elementToProof"
                style="font-family:Calibri,Helvetica,sans-serif; font-size:10pt; color:rgb(0,0,0); background-color:rgb(255,255,255)">
                <br></div>
            <div class="x_elementToProof"
                style="font-family:Calibri,Helvetica,sans-serif; font-size:10pt; color:rgb(0,0,0); background-color:rgb(255,255,255)">
                <br></div>
            <div class="x_elementToProof"
                style="font-family:Calibri,Helvetica,sans-serif; font-size:10pt; color:rgb(0,0,0); background-color:rgb(255,255,255)">
                <br></div>
            <div class="x_elementToProof"
                style="font-family:Calibri,Helvetica,sans-serif; font-size:10pt; color:rgb(0,0,0); background-color:rgb(255,255,255)">
                <br></div>
            <div class="x_elementToProof"
                style="font-family:Calibri,Helvetica,sans-serif; font-size:10pt; color:rgb(0,0,0); background-color:rgb(255,255,255)">
                <br></div>
            <div class="x_elementToProof"
                style="font-family:Calibri,Helvetica,sans-serif; font-size:10pt; color:rgb(0,0,0); background-color:rgb(255,255,255)">
                <br></div>
            <div class="x_elementToProof"
                style="font-family:Calibri,Helvetica,sans-serif; font-size:10pt; color:rgb(0,0,0); background-color:rgb(255,255,255)">
                <br></div>
            <div class="x_elementToProof"
                style="font-family:Calibri,Helvetica,sans-serif; font-size:10pt; color:rgb(0,0,0); background-color:rgb(255,255,255)">
                <br></div>
            <div class="x_elementToProof"
                style="font-family:Calibri,Helvetica,sans-serif; font-size:10pt; color:rgb(0,0,0); background-color:rgb(255,255,255)">
                <br></div>
            <div class="x_elementToProof"
                style="font-family:Calibri,Helvetica,sans-serif; font-size:10pt; color:rgb(0,0,0); background-color:rgb(255,255,255)">
                <br></div>
            <div class="x_elementToProof"
                style="font-family:Calibri,Helvetica,sans-serif; font-size:10pt; color:rgb(0,0,0); background-color:rgb(255,255,255)">
                <br></div>
            <div class="x_elementToProof"
                style="font-family:Calibri,Helvetica,sans-serif; font-size:10pt; color:rgb(0,0,0); background-color:rgb(255,255,255)">
                <br></div>
            <div class="x_elementToProof"
                style="font-family:Calibri,Helvetica,sans-serif; font-size:10pt; color:rgb(0,0,0); background-color:rgb(255,255,255)">
                <br></div>
            <div class="x_elementToProof"
                style="font-family:Calibri,Helvetica,sans-serif; font-size:10pt; color:rgb(0,0,0); background-color:rgb(255,255,255)">
                <br></div>
            <div class="x_elementToProof"
                style="font-family:Calibri,Helvetica,sans-serif; font-size:10pt; color:rgb(0,0,0); background-color:rgb(255,255,255)">
                <br></div>
            <div class="x_elementToProof"
                style="font-family:Calibri,Helvetica,sans-serif; font-size:10pt; color:rgb(0,0,0); background-color:rgb(255,255,255)">
                <br></div>
            <div class="x_elementToProof"
                style="font-family:Calibri,Helvetica,sans-serif; font-size:10pt; color:rgb(0,0,0); background-color:rgb(255,255,255)">
                <br></div>
            <div class="x_elementToProof"
                style="font-family:Calibri,Helvetica,sans-serif; font-size:10pt; color:rgb(0,0,0); background-color:rgb(255,255,255)">
                <br></div>
            <div class="x_elementToProof"
                style="font-family:Calibri,Helvetica,sans-serif; font-size:10pt; color:rgb(0,0,0); background-color:rgb(255,255,255)">
                <br></div>
            <div class="x_elementToProof"
                style="font-family:Calibri,Helvetica,sans-serif; font-size:10pt; color:rgb(0,0,0); background-color:rgb(255,255,255)">
                <br></div>
            <div id="x_Signature">
                <div>
                    <p
                        style="margin-top:0px; margin-bottom:0px; margin-top:0px; margin-bottom:0px; margin-top:0px; margin-bottom:0px; margin-top:0px; margin-bottom:0px; margin:0cm; font-size:11pt; font-family:Calibri,sans-serif">
                    </p>
                </div>
            </div>
        </div>`
        const mailList = ['mona44146@outlook.com']
        const message = "";
        const subject = "Task updated successfully";
    

        Mailer.sendMail(mailList, message, subject, template).then((response) => {
            console.log(response);
        }).catch((error) => {
            console.log(error);
        });
            
            res.send(
                {
                    "message": "Task successfully updated",
                    "response": response
                }
            );
        })
        .catch(err => {
            console.log('err:',err);
            
            res.status(500).send({
                message: err.message || "Some error occurred"
            });
        });
};
 

// Get req
export const getTask = (req: Request, res: Response) => { 
    CreateTask.find()
        .then((response) => {
           // res.send({ message: response });
           res.send(response); 

        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred"
            });
        });
};






export const deleteTask = (req: Request, res: Response) => {
    console.log('?',req.params);
    
    CreateTask.deleteMany({ id: req.params.id })
    .then((response: any) => { 
        res.json({
            "message": "Task successfully deleted!",
            "response": response
        });


        let template=`<div class="x_elementToProof">
        <div class="x_elementToProof"
            style="font-family:Calibri,Helvetica,sans-serif; font-size:10pt; color:rgb(0,0,0); background-color:rgb(255,255,255)">
            <br></div>
        <div class="x_elementToProof"
            style="text-align:center; font-family:Calibri,Helvetica,sans-serif; font-size:10pt; color:rgb(0,0,0); background-color:rgb(255,255,255)">
            <span id="x_✅" style="font-size:100pt">✅</span><br></div>
        <div class="x_elementToProof elementToProof"
            style="text-align:center; font-family:Calibri,Helvetica,sans-serif; font-size:10pt; color:rgb(0,0,0); background-color:rgb(255,255,255)">
            <span class="x_chakra-alert__title x_css-zvy4 x_ContentPasted1"
                style="border-width:0px; border-style:solid; box-sizing:border-box; color:rgb(45,55,72); font-family:Comic Sans MS,Chalkboard,cursive; font-size:20pt"><b>Your
                    task has been successfully deleted!</b></span><br class="x_ContentPasted1"></div>
        <div class="x_elementToProof elementToProof"
            style="text-align:center; font-family:Calibri,Helvetica,sans-serif; font-size:10pt; color:rgb(0,0,0); background-color:rgb(255,255,255)">
            <span class="x_chakra-alert__desc x_css-xbzfl4 x_ContentPasted1"
                style="border-width:0px; border-style:solid; box-sizing:border-box; display:inline; color:rgb(45,55,72); font-family:Comic Sans MS,Chalkboard,cursive; font-size:12pt"><span
                    id="x_😊" style="font-size: 25pt;">😊</span></span><br></div>
        <div class="x_elementToProof"
            style="font-family:Calibri,Helvetica,sans-serif; font-size:10pt; color:rgb(0,0,0); background-color:rgb(255,255,255)">
            <br></div>
        <div class="x_elementToProof"
            style="font-family:Calibri,Helvetica,sans-serif; font-size:10pt; color:rgb(0,0,0); background-color:rgb(255,255,255)">
            <br></div>
        <div class="x_elementToProof"
            style="font-family:Calibri,Helvetica,sans-serif; font-size:10pt; color:rgb(0,0,0); background-color:rgb(255,255,255)">
            <br></div>
        <div class="x_elementToProof"
            style="font-family:Calibri,Helvetica,sans-serif; font-size:10pt; color:rgb(0,0,0); background-color:rgb(255,255,255)">
            <br></div>
        <div class="x_elementToProof"
            style="font-family:Calibri,Helvetica,sans-serif; font-size:10pt; color:rgb(0,0,0); background-color:rgb(255,255,255)">
            <br></div>
        <div class="x_elementToProof"
            style="font-family:Calibri,Helvetica,sans-serif; font-size:10pt; color:rgb(0,0,0); background-color:rgb(255,255,255)">
            <br></div>
        <div class="x_elementToProof"
            style="font-family:Calibri,Helvetica,sans-serif; font-size:10pt; color:rgb(0,0,0); background-color:rgb(255,255,255)">
            <br></div>
        <div class="x_elementToProof"
            style="font-family:Calibri,Helvetica,sans-serif; font-size:10pt; color:rgb(0,0,0); background-color:rgb(255,255,255)">
            <br></div>
        <div class="x_elementToProof"
            style="font-family:Calibri,Helvetica,sans-serif; font-size:10pt; color:rgb(0,0,0); background-color:rgb(255,255,255)">
            <br></div>
        <div class="x_elementToProof"
            style="font-family:Calibri,Helvetica,sans-serif; font-size:10pt; color:rgb(0,0,0); background-color:rgb(255,255,255)">
            <br></div>
        <div class="x_elementToProof"
            style="font-family:Calibri,Helvetica,sans-serif; font-size:10pt; color:rgb(0,0,0); background-color:rgb(255,255,255)">
            <br></div>
        <div class="x_elementToProof"
            style="font-family:Calibri,Helvetica,sans-serif; font-size:10pt; color:rgb(0,0,0); background-color:rgb(255,255,255)">
            <br></div>
        <div class="x_elementToProof"
            style="font-family:Calibri,Helvetica,sans-serif; font-size:10pt; color:rgb(0,0,0); background-color:rgb(255,255,255)">
            <br></div>
        <div class="x_elementToProof"
            style="font-family:Calibri,Helvetica,sans-serif; font-size:10pt; color:rgb(0,0,0); background-color:rgb(255,255,255)">
            <br></div>
        <div class="x_elementToProof"
            style="font-family:Calibri,Helvetica,sans-serif; font-size:10pt; color:rgb(0,0,0); background-color:rgb(255,255,255)">
            <br></div>
        <div class="x_elementToProof"
            style="font-family:Calibri,Helvetica,sans-serif; font-size:10pt; color:rgb(0,0,0); background-color:rgb(255,255,255)">
            <br></div>
        <div class="x_elementToProof"
            style="font-family:Calibri,Helvetica,sans-serif; font-size:10pt; color:rgb(0,0,0); background-color:rgb(255,255,255)">
            <br></div>
        <div class="x_elementToProof"
            style="font-family:Calibri,Helvetica,sans-serif; font-size:10pt; color:rgb(0,0,0); background-color:rgb(255,255,255)">
            <br></div>
        <div class="x_elementToProof"
            style="font-family:Calibri,Helvetica,sans-serif; font-size:10pt; color:rgb(0,0,0); background-color:rgb(255,255,255)">
            <br></div>
        <div class="x_elementToProof"
            style="font-family:Calibri,Helvetica,sans-serif; font-size:10pt; color:rgb(0,0,0); background-color:rgb(255,255,255)">
            <br></div>
        <div class="x_elementToProof"
            style="font-family:Calibri,Helvetica,sans-serif; font-size:10pt; color:rgb(0,0,0); background-color:rgb(255,255,255)">
            <br></div>
        <div class="x_elementToProof"
            style="font-family:Calibri,Helvetica,sans-serif; font-size:10pt; color:rgb(0,0,0); background-color:rgb(255,255,255)">
            <br></div>
        <div class="x_elementToProof"
            style="font-family:Calibri,Helvetica,sans-serif; font-size:10pt; color:rgb(0,0,0); background-color:rgb(255,255,255)">
            <br></div>
        <div id="x_Signature">
            <div>
                <p
                    style="margin-top:0px; margin-bottom:0px; margin-top:0px; margin-bottom:0px; margin-top:0px; margin-bottom:0px; margin-top:0px; margin-bottom:0px; margin:0cm; font-size:11pt; font-family:Calibri,sans-serif">
                </p>
            </div>
        </div>
    </div>`
    const mailList = ['mona44146@outlook.com']
    const message = "";
    const subject = "Task deleted successfully";


    Mailer.sendMail(mailList, message, subject, template).then((response) => {
        console.log(response);
    }).catch((error) => {
        console.log(error);
    });
    });
};