const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const cors = require('./cors');
const Favourites = require('../models/favourites');

const favouriteRouter = express.Router();

favouriteRouter.use(bodyParser.json());

favouriteRouter
	.route('/')
	.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
	.get(cors.cors, (req, res, next) => {
		Favourites.find({})
			.populate('dishes')
			.populate('users')
			.then(
				favourites => {
					res.sendStatus(200);
					res.setHeader('Content-Tpye', 'application/json');
					res.json(favourites);
				},
				err => next(err)
			)
			.catch(err => next(err));
	})
	.post(
		cors.cors,
		authenticate.verifyUser,
		authenticate.verifyAdmin,
		(req, res, next) => {
			Favorites.findOne({ user: req.user._id })
				.then(favorite => {
					if (favorite == null) {
						Favorites.create().then(
							favorite => {
								res.statusCode = 200;
								res.setHeader('Content-Type', 'application/json');
								for (const i in req.body) {
									favorite.dishes.push(req.body[i]);
								}
								favorite.save();
								res.json(favorite);
							},
							err => next(err)
						);
					} else {
						for (let i in req.body) {
							Favorites.findOne({ user: newFavorite.user }).then(
								oldFavorite => {
									if (oldFavorite == null) {
										favorite.dishes.push(req.body[i]);
									}
								}
							);
						}
						favorite.save();
						res.statusCode = 200;
						res.setHeader('Content-Type', 'application/json');
						res.json(favorite);
					}
				})
				.catch(err => next(err));
		}
	)
	.put(
		cors.corsWithOptions,
		authenticate.verifyUser,
		authenticate.verifyAdmin,
		(req, res, next) => {
			res.statusCode = 403;
			res.end('PUT operation not supported on /favourites');
		}
	)
	.delete(
		cors.corsWithOptions,
		authenticate.verifyUser,
		authenticate.verifyAdmin,
		(req, res, next) => {
			Favourites.remove({})
				.then(
					resp => {
						res.statusCode = 200;
						res.setHeader('Content-Type', 'application/json');
						res.json(resp);
					},
					err => next(err)
				)
				.catch(err => next(err));
		}
	);

favouriteRouter
	.route('/:favouriteID')
	.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
	.get(cors.cors, (req, res, next) => {
		Favourites.findById({ _id: req.params.favoriteId })
			.then(
				favorite => {
					if (!favorite.user.equals(req.user._id)) {
						const err = new Error('Only creator can perform this');
						err.status = 401;
						return next(err);
					}
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					res.json(favorite);
				},
				err => next(err)
			)
			.catch(err => next(err));
	})
	.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
		Favorites.findById(req.body._id).then(favorite => {
			if (favorite == null) {
				let newFavorite = {};
				newFavorite.user = req.user._id;
				Favorites.create(newFavorite)
					.then(
						favorite => {
							console.log('Favorite Created ', newFavorite);
							favorite.dishes.push(req.params.favoriteId);
							favorite.save().then(
								favorite => {
									Dishes.findById(favorite._id).then(favorite => {
										res.statusCode = 200;
										res.setHeader('Content-Type', 'application/json');
										res.json(favorite);
									});
								},
								err => next(err)
							);
						},
						err => next(err)
					)
					.catch(err => next(err));
			} else {
				err = new Error('Dish ' + req.params.dishId + ' already exist');
				err.status = 404;
				return next(err);
			}
		});
	})
	.put(
		cors.cors,
		authenticate.verifyUser,
		authenticate.verifyAdmin,
		(req, res, next) => {
			Favorites.findByIdAndUpdate(
				req.params.favoriteId,
				{
					$set: req.body,
				},
				{ new: true }
			)
				.then(
					favorite => {
						res.statusCode = 200;
						res.setHeader('Content-Type', 'application/json');
						res.json(favorite);
					},
					err => next(err)
				)
				.catch(err => next(err));
		}
	)
	.delete(
		cors.cors,
		authenticate.verifyUser,
		authenticate.verifyAdmin,
		(req, res, next) => {
			Favorites.findOne({ user: req.user._id })
				.then(favorite => {
					favorite.dishes.remove(req.params.favoriteId);
					favorite.save().then(
						dish => {
							res.statusCode = 200;
							res.setHeader('Content-Type', 'application/json');
							res.json(favorite);
						},
						err => next(err)
					);
				})
				.catch(err => next(err));
		}
	);

module.exports = favoriteRouter;
