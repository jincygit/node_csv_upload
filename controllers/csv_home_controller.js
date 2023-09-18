/** ------------------ IMPORTING PACKAGE/MODELS ------------------ **/
const fs = require('fs');
const csv = require('csv-parser');
const CSV = require('../models/csv');
const path = require('path');


/** ------------------ EXPORTING FUNCTION To open home page ------------------ **/
module.exports.home = async function(req, res) {
    try {
        let file = await CSV.find({});
        return res.render('csv_home', {
            files: file,
            title: "CSV Upload Home"
        });
    } catch (error) {
        console.log('Error in homeController/home', error);
        return;
    }
}


/** ------------------ EXPORTING FUNCTION To upload a file ------------------ **/
module.exports.upload = async function(req, res) {
    try {
        console.log(req.file);
        // file is not present
        if(!req.file) {
            req.flash('error', 'No files were uploaded.');
            return res.status(400).send('No files were uploaded.');
        }
        // checking if file is csv or not
        if(req.file.mimetype != "text/csv") {
            req.flash('error', 'Select CSV files only.');
            return res.status(400).send('Select CSV files only.');
        }
        // console.log(req.file);
        let file = await CSV.create({
            fileName: req.file.originalname,
            filePath: req.file.path,
            file: req.file.filename
        });
        return res.redirect('back');
    } catch (error) {
        req.flash('error', err);
        console.log('Error in fileController/upload', error);
        res.status(500).send('Internal server error');
    }
}


/** ------------------ EXPORTING FUNCTION To open file viewer page ------------------ **/
module.exports.view = async function(req, res) {
    try {
        //console.log(req.params);
        let csvFile = await CSV.findOne({_id: req.params.id});
        //console.log(csvFile);
        const results = [];
        const header =[];
        fs.createReadStream(csvFile.filePath) //seeting up the path for file upload
        .pipe(csv())
        .on('headers', (headers) => {
            headers.map((head) => {
                header.push(head);
            });
            // console.log(header);
        })
        .on('data', (data) =>
        results.push(data))
        .on('end', () => {
            // console.log(results.length);
            // console.log(results);
            res.render("file", {
                title: "File Viewer",
                fileName: csvFile.fileName,
                csvFile: csvFile,
                head: header,
                data: results,
                length: results.length
            });
        });


    } catch (error) {
        console.log('Error in fileController/view', error);
        res.status(500).send('Internal server error');
    }
}

module.exports.showFile = async function (req, res) {

    //console.log('inside showfile', req.query);
    //console.log(req.params);

    let filePath = await CSV.findById(req.query.file_id);
    //console.log(filePath);
    const perPageLimit = 100;

    const results = [];
    const header = [];
    if(filePath){
        //STEAMING THE FILE
        fs.createReadStream(filePath.filePath)
            .pipe(csv())
            .on("headers", (Headers) => {
                Headers.map((head) => {
                    header.push(head);
                });
                console.log("header => ", header);

            })
            .on("data", (data) => results.push(data))
            .on("end", () => {
                //console.log("lenth ... ",results.length);
                let page = req.query.page;
                //console.log('page => ',req.query.page);
                //let startSlice = (page - 1) * perPageLimit + 1;
                let startSlice = (page - 1) * perPageLimit;
                let endSlice = page * perPageLimit;
                //console.log("startSlice ... ",startSlice);
                //console.log("endSlice ... ",endSlice);
                let SliceResults = [];
                let totalPages = Math.ceil(results.length / perPageLimit);
                //console.log("totalPages ... ",totalPages);
                //console.log("results ... ",results);

                if (endSlice < results.length) {
                    SliceResults = results.slice(startSlice, endSlice);
                } else {
                    SliceResults = results.slice(startSlice);
                }
                //console.log("SliceResults ... ",SliceResults.length);
                var displayPagesLength = 0;
                if((parseInt(parseInt(req.query.page)+parseInt(5)))>=parseInt(totalPages)){
                    displayPagesLength=totalPages;
                }else{
                    
                    displayPagesLength=parseInt(parseInt(req.query.page)+5);
                }
                //csv_file_details
                return res.render('file', {
                    title: filePath.originalName,
                    head: header,
                    data: SliceResults,
                    length: results.length,
                    page: req.query.page,
                    currentPage: parseInt(req.query.page),
                    displayPagesLength: parseInt(displayPagesLength),
                    totalPages: parseInt(totalPages),
                    file: filePath,
                    csvFile: filePath,
                })
            });
    }


}


/** ------------------ EXPORTING FUNCTION To delete the file ------------------ **/
module.exports.delete = async function(req, res) {
    try {
        // console.log(req.params);
        let isFile = await CSV.findOne({file: req.params.id});

        if(isFile){
            await CSV.deleteOne({file: req.params.id});            
            return res.redirect("/");
        }else{
            console.log("File not found");
            return res.redirect("/");
        }
    } catch (error) {
        console.log('Error in fileController/delete', error);
        return;
    }
}