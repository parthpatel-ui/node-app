const Todo = require('../models/task');

// Database and Collection Name

// Get Document by ID
async function getDocumentById(req, res) {
    try {
        // Find the document by ID and ensure it's active
        const document = await Todo.findOne({ _id: req.params.id });
        if (!document) {
            return res.status(404).json({ message: 'Document not found', success: false });
        }
        res.status(200).json(document);
    } catch (error) {
        console.error('Error:', error);
        res.status(400).json({ message: 'Something went wrong', success: false });
    }
}

// Get all active documents
async function getAllDocuments(req, res) {
    try {
        const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc', status } = req.query;
        
        //Filtering
        const filter = {};
        if(status) filter.status = status;

        //Sorting
        const order = sortOrder === 'asc' ? 1 : -1;
        const sort = { [sortBy]: order };
        
        const skip = (page - 1) * limit;

        const tasks = await Todo.find(filter).sort(sort).skip(skip).limit(limit);

        const totalTasks = await Todo.countDocuments(filter);


        // Prepare the response with pagination info
        res.status(200).json({
            tasks,
            pagination: {
                totalTasks,
                totalPages: Math.ceil(totalTasks / limit),
                currentPage: page,
                pageSize: limit
            }
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(400).json({ message: 'Something went wrong', success: false });
    }
}


async function createTodo(req, res) {
    try {
        const { title, description, status } = req.body;

        // Create a new Todo document
        const newTodo = new Todo({
            title,
            description,
            status,
        });

        // Save to the database
        const savedTodo = await newTodo.save();

        // Return the created record
        res.status(201).json(savedTodo);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error creating Todo', error: err.message });
    }
}

async function updateDocumentById(req, res) {
    try {
        const { id } = req.params;
        const updateData = req.body;

        updateData.updatedAt = Date.now();
        
        // Find and update the document by ID
        const updatedDocument = await Todo.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true }
        );

        if (!updatedDocument) {
            return res.status(404).json({ message: 'Document not found', success: false });
        }

        res.status(200).json({ message: 'Document updated successfully', success: true, updatedDocument });
    } catch (error) {
        console.error('Error:', error);
        res.status(400).json({ message: 'Something went wrong', success: false });
    }
}

async function deleteDocumentById(req, res) {
    try {
        const { id } = req.params;  // Extract ID from the request parameters

        // Find and delete the document by ID
        const deletedDocument = await Todo.findByIdAndDelete(id);

        if (!deletedDocument) {
            return res.status(404).json({ message: 'Document not found', success: false });
        }

        res.status(200).json({ message: 'Document deleted successfully', success: true });
    } catch (error) {
        console.error('Error:', error);
        res.status(400).json({ message: 'Something went wrong', success: false });
    }
}


module.exports = {
    getAllDocuments,
    getDocumentById,
    createTodo,
    updateDocumentById,
    deleteDocumentById
};