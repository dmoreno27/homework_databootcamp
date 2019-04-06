-- Homework Assignment
-- Instructions

CREATE DATABASE sakila;
USE Sakila;
SELECT * FROM actor;

-- 1a. Display the first and last names of all actors from the table actor.
SELECT first_name, last_name FROM actor;

-- 1b. Display the first and last name of each actor in a single column in upper case letters. 
-- Name the column Actor Name.
SELECT CONCAT(first_name, ' ', last_name) AS 'Actor Name' FROM actor;

-- 2a. You need to find the ID number, first name, and last name of an actor, of whom you know 
-- only the first name, "Joe." What is one query would you use to obtain this information?
SELECT actor_id, first_name, last_name FROM actor WHERE first_name="Joe";

-- 2b. Find all actors whose last name contain the letters GEN:
SELECT * FROM actor WHERE last_name LIKE'%GEN%';

-- 2c. Find all actors whose last names contain the letters LI. This time, order the rows by 
-- last name and first name, in that order:
SELECT * FROM actor WHERE last_name LIKE'%LI%' ORDER BY last_name ASC, first_name ASC;

-- 2d. Using IN, display the country_id and country columns of the following countries: 
-- Afghanistan, Bangladesh, and China:
SELECT country_id, country FROM country WHERE country IN ("Afghanistan", "Bangladesh", "China");

-- 3a. You want to keep a description of each actor. You don't think you will be performing 
-- queries on a description, so create a column in the table actor named description and use the 
-- data type BLOB (Make sure to research the type BLOB, as the difference between it and VARCHAR 
-- are significant).
ALTER TABLE actor
  ADD description BLOB;


-- 3b. Very quickly you realize that entering descriptions for each actor is too much effort. 
-- Delete the description column.
ALTER TABLE actor
DROP description;

SELECT * FROM actor;

-- 4a. List the last names of actors, as well as how many actors have that last name.
SELECT last_name, COUNT(last_name) 
FROM actor
GROUP BY last_name
ORDER BY last_name ASC;


-- 4b. List last names of actors and the number of actors who have that last name, but only 
-- for names that are shared by at least two actors
SELECT last_name, COUNT(last_name) 
FROM actor
GROUP BY last_name
HAVING COUNT(last_name) >= 2;

-- 4c. The actor HARPO WILLIAMS was accidentally entered in the actor table as GROUCHO WILLIAMS. 
-- Write a query to fix the record.
UPDATE actor
SET 
first_name = REPLACE (first_name,'GROUCHO','HARPO') WHERE first_name= "GROUCHO";

SELECT * FROM actor WHERE last_name = 'WILLIAMS';
-- 4d. Perhaps we were too hasty in changing GROUCHO to HARPO. It turns out that GROUCHO was the 
-- correct name after all! In a single query, if the first name of the actor is currently HARPO, 
-- change it to GROUCHO.
UPDATE actor
SET 
first_name = REPLACE (first_name,'HARPO','GROUCHO') WHERE last_name= "WILLIAMS";

-- 5a. You cannot locate the schema of the address table. Which query would you use to re-create it?
-- Hint: https://dev.mysql.com/doc/refman/5.7/en/show-create-table.html

SHOW CREATE TABLE address;

-- 6a. Use JOIN to display the first and last names, as well as the address, of each staff member. 
-- Use the tables staff and address:

SELECT staff.first_name, staff.last_name, address.address
FROM staff 
LEFT JOIN address 
ON staff.address_id=address.address_id;

-- 6b. Use JOIN to display the total amount rung up by each staff member in August of 2005. 
-- Use tables staff and payment.

SELECT staff.staff_id, staff.first_name, staff.last_name, SUM(payment.amount) AS total_amount
FROM staff INNER JOIN payment
ON staff.staff_id=payment.staff_id
GROUP BY staff.staff_id, staff.first_name;

-- 6c. List each film and the number of actors who are listed for that film. Use tables film_actor 
-- and film. Use inner join.

SELECT film.film_id, film.title, COUNT(film_actor.actor_id) AS actors_in_film
FROM film INNER JOIN film_actor
ON film.film_id=film_actor.film_id
GROUP BY film.film_id, film.title;

-- 6d. How many copies of the film Hunchback Impossible exist in the inventory system?
SELECT * FROM inventory;

SELECT film_id INTO @hunchback FROM film WHERE title="Hunchback Impossible";
SELECT COUNT(film_id) FROM inventory WHERE film_id = @hunchback;

-- 6e. Using the tables payment and customer and the JOIN command, list the total paid by each customer. 
-- List the customers alphabetically by last name:

SELECT c.customer_id, c.first_name, c.last_name, SUM(p.amount) AS total_amount_customer
FROM customer c JOIN payment p
ON c.customer_id=p.customer_id
GROUP BY c.customer_id, c.first_name
ORDER BY c.last_name ASC;

-- 7a. The music of Queen and Kris Kristofferson have seen an unlikely resurgence. 
-- As an unintended consequence, films starting with the letters K and Q have also soared in popularity. 
-- Use subqueries to display the titles of movies starting with the letters K and Q whose language is English.

SELECT * FROM film WHERE (title LIKE 'K%' OR title LIKE 'Q%') 
AND language_id IN (SELECT language_id FROM language WHERE name="English");

-- 7b. Use subqueries to display all actors who appear in the film Alone Trip.

SELECT * FROM actor
WHERE actor_id IN (SELECT actor_id FROM film_actor 
WHERE film_id IN (SELECT film_id FROM film 
WHERE title="Alone Trip"));

-- 7c. You want to run an email marketing campaign in Canada, for which you will need the names and 
-- email addresses of all Canadian customers. Use joins to retrieve this information.
SELECT cu.first_name, cu.last_name, cu.email
FROM customer cu 
	JOIN address a
		ON a.address_id=cu.address_id
    JOIN city ci
		ON ci.city_id=a.city_id
	JOIN country co
		ON co.country_id=ci.country_id
WHERE co.country="Canada";

-- 7d. Sales have been lagging among young families, and you wish to target all family movies for a 
-- promotion. Identify all movies categorized as family films.
SELECT * FROM film_list WHERE category="Family";

-- -----------------------------------------------------

-- 7e. Display the most frequently rented movies in descending order. 

SELECT r.inventory_id, COUNT(r.inventory_id) AS frequency, i.film_id, f.title 
	FROM rental r
		LEFT JOIN inventory i
			ON r.inventory_id=i.inventory_id
		LEFT JOIN film f
			ON i.film_id=f.film_id
		GROUP BY r.inventory_id
        ORDER BY frequency DESC;
        
-- 7f. Write a query to display how much business, in dollars, each store brought in.
SELECT * FROM sales_by_store;

-- 7g. Write a query to display for each store its store ID, city, and country.
SELECT s.store_id, ci.city, co.country
FROM store s
	JOIN address a
		ON a.address_id=s.address_id
	JOIN city ci
		ON a.city_id=ci.city_id
	JOIN country co
		ON ci.country_id=co.country_id;

-- 7h. List the top five genres in gross revenue in descending order. (Hint: you may need to use the 
-- following tables: category, film_category, inventory, payment, and rental.)
SELECT * FROM sales_by_film_category ORDER BY total_sales DESC LIMIT 5;

-- 8a. In your new role as an executive, you would like to have an easy way of viewing the Top five 
-- genres by gross revenue. Use the solution from the problem above to create a view. If you haven't 
-- solved 7h, you can substitute another query to create a view.
CREATE VIEW top_revenue_films AS 
SELECT * FROM sales_by_film_category ORDER BY total_sales DESC LIMIT 5;

-- 8b. How would you display the view that you created in 8a?
SELECT * FROM top_revenue_films;

-- 8c. You find that you no longer need the view top_five_genres. Write a query to delete it.
DROP VIEW IF EXISTS top_revenue_films;


