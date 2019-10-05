'use strict';

module.exports = function(app) {
	var todoList = require('../controllers/todoListController');
	var	userInfo = require('../controllers/userInfoController');
	var categoryInfo = require('../controllers/categoryController');


	app.route('/users')
		.get(userInfo.list_all_users)
		.post(userInfo.create_a_user)

	app.route('/users/:userId')
		.get(userInfo.read_a_user)
		.put(userInfo.update_a_user)
		.delete(userInfo.delete_a_user);

	app.route('/logout')
		.get(userInfo.logout);
	// todoList Routes
	app.route('/tasks')
		.get(todoList.list_all_tasks)
		.post(todoList.create_a_task);

	app.route('/tasks/:taskId')
		.get(todoList.read_a_task)
		.put(todoList.update_a_task)
		.delete(todoList.delete_a_task);

	app.route('/categories')
		.get(categoryInfo.list_all_categories)
		.post(categoryInfo.create_a_category);

	app.route('/categories/:categoryId')
		.get(categoryInfo.read_a_category)
		.put(categoryInfo.update_a_category)
		.delete(categoryInfo.delete_a_category);
};
