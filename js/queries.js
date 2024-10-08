﻿const mssql = require('mssql');
const connection = require('./config');

module.exports = {
    login: async (req, res) => {
        try {
            const { login, password } = req.body;
            const pool = await connection;
            const request = pool.request();
    
            let adminExists = await request
                .input('login', mssql.VarChar, login)
                .input('password', mssql.VarChar, password)
                .query('SELECT COUNT(*) AS count FROM login WHERE login = @login AND password = @password');
    
            if (adminExists.recordset[0].count > 0) {

                res.cookie('adminLogin', login, { maxAge: 900000, httpOnly: true });
                
                let tableRows = '';

                const result = await request.query("SELECT * FROM items");

                result.recordset.forEach(row => {
                    tableRows += `<tr>
                        <td>
                            <span class="glyphicon glyphicon-pencil edit" style="cursor: pointer" id="${row.id}">&nbsp;</span>
                            <span class="glyphicon glyphicon-remove delete" style="cursor: pointer" id="${row.id}">&nbsp;</span>
                            ${row.name}
                        </td>
                        <td>${row.description}</td>
                        <td>${row.completed ? 'yes' : 'no'}</td>
                    </tr>`;
                });
    
                res.render('index', { data: tableRows, buttons: req.url !== '/' });
            } else {
                res.status(401).send('Invalid login or password');
            }
    
        } catch (err) {
            console.log(err);
            res.status(500).send('Error during admin login');
        }
    },
    

    insertItem: async function (data, req, res) {
        const inserts = {
            name: data.name,
            description: data.description,
            completed: parseInt(data.completed)
        };

        try {
            const pool = await connection;
            const ps = new mssql.PreparedStatement(pool);
            ps.input('name', mssql.Text);
            ps.input('description', mssql.Text);
            ps.input('completed', mssql.Int);

            await ps.prepare("INSERT INTO items (name, description, completed) VALUES (@name, @description, @completed)");
            await ps.execute(inserts);
            console.log('Item added');
            await ps.unprepare();
            res.send('Item added successfully');
        } catch (err) {
            console.error('Error inserting item:', err);
            res.status(500).send('Internal Server Error');
        }
    },

    loadItemById: async function (req, res) {
        const inserts = {
            id: parseInt(req.params.id)
        };

        try {
            const pool = await connection;
            const ps = new mssql.PreparedStatement(pool);
            ps.input('id', mssql.Int);

            await ps.prepare('SELECT * FROM items WHERE id=@id');
            const result = await ps.execute(inserts);
            const row = result.recordset[0];

            if (row) {
                res.render('edit_item_page', {
                    id: row.id,
                    name: row.name,
                    description: row.description,
                    completed: row.completed
                });
            } else {
                res.status(404).send('Item not found');
            }
            await ps.unprepare();
        } catch (err) {
            console.error('Error loading item by ID:', err);
            res.status(500).send('Internal Server Error');
        }
    },

    updateItem: async function (req, res) {
        const inserts = {
            id: parseInt(req.body.id),
            name: req.body.name,
            description: req.body.description,
            completed: parseInt(req.body.completed)
        };

        try {
            const pool = await connection;
            const ps = new mssql.PreparedStatement(pool);
            ps.input('id', mssql.Int);
            ps.input('name', mssql.Text);
            ps.input('description', mssql.Text);
            ps.input('completed', mssql.Int);

            await ps.prepare("UPDATE items SET name=@name, description=@description, completed=@completed WHERE id=@id");
            await ps.execute(inserts);
            console.log('Item updated');
            await ps.unprepare();
            res.send('Item updated successfully');
        } catch (err) {
            console.error('Error updating item:', err);
            res.status(500).send('Internal Server Error');
        }
    },

    deleteItem: async function (req, res) {
        const inserts = {
            id: parseInt(req.params.id)
        };

        try {
            const pool = await connection;
            const ps = new mssql.PreparedStatement(pool);
            ps.input('id', mssql.Int);

            await ps.prepare('DELETE FROM items WHERE id=@id');
            await ps.execute(inserts);
            console.log('Item deleted');
            await ps.unprepare();
            res.send('Item deleted successfully');
        } catch (err) {
            console.error('Error deleting item:', err);
            res.status(500).send('Internal Server Error');
        }
    }
};
