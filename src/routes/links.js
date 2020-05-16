const express = require('express');
const router = express.Router();

//aqui hace referencia a la coneccio de la base de datos
const pool = require('../database');
const {isLoggedIn} =require('../lib/auth');

router.get('/add', isLoggedIn, (req, res) => {
    res.render('links/add');
});

//aqui recibe los datos del formulario
router.post('/add',isLoggedIn, async (req, res) => {
    const { title, url, description }  = req.body;
    const newLink = {
        title,
         url,
          description,
          user_id: req.user.id 
    };
      await pool.query('INSERT INTO links set ?', [newLink]);
      req.flash('success', 'Link saved succesfully');
    //res.send('received');
    res.redirect('/links');
});

    router.get('/', isLoggedIn, async (req, res) => {
         const links = await pool.query('SELECT * FROM links WHERE user_id = ?', req.user.id);

         res.render('links/list', {links});
        //console.log(links);
        //res.send('listas iran aqui');
    });

    router.get('/delete/:id', isLoggedIn, async (req, res) => {
        const { id } = req.params;
       await pool.query('DELETE FROM links WHERE ID = ?', [id]);
       req.flash('success', 'Link removed succesfully');
       res.redirect('/links');
       // console.log(req.params.id);
        //res.send('DELETED');
    });

    router.get('/edit/:id', isLoggedIn, async (req, res) => {
        const { id } = req.params;
        const links = await pool.query('SELECT * FROM links WHERE id = ?', [id]);
       // console.log(links[0]);
        res.render('links/edit', {link: links[0]});
       // console.log(id);
        //res.send('received');
    });

    router.post('/edit/:id', isLoggedIn, async (req, res) => {
        const { id } = req.params;
        const { title, url, description }  = req.body;
        const newLink = {
            title,
             url,
              description
        };
        console.log(newLink);
        //res.send('UPDATED');
        await pool.query('UPDATE links set ? WHERE id = ?', [newLink, id]);
        req.flash('success', 'Link updated succesfully');
               res.redirect('/links');
    });

module.exports = router;