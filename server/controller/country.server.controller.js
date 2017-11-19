var CountryModel  = require('../model/country.server.model.js');
var globals       = require('../../config/globals');

module.exports = {

  /**
   * Add country and its code to the database
   * req.body = {
   *    @param {name} string
   *    @param {code} string
   * }
   */
  addCountry: function (req, res) {
    var code = req.body.code;
    var name = req.body.name;
    CountryModel.findOne({code: code})
      .then(function (c) {
        if (c) {
          throw new Error('409');
        }
        if (!code || !name) {
          throw new Error('400');
        }
        var country = new CountryModel({
          code:   code,
          name:   name,
        });
        return country.save();
      })
      .then(function (c) {
        return res.status(201).json({message: 'Country saved'});
      })
      .catch(function (error) {
        if (error.message === '409') {
          return res.status(409).json({message: 'Code Already exists'});
        } else if (error.message === '400') {
          return res.status(400).json({message: 'Bad Request'});
        } else {
          return res.status(500).json({message: err.message});
        }
      });
  },

  /**
   * Return list of  countries and its code from the database
   * req.query = {
   *    @param {limit} number
   *    @param {page} number
   * }
   */
  listCountries: function (req, res) {
    var page = parseInt(req.query.page);
    if (!page) {
      page = 1;
    }
    var limit = parseInt(req.query.limit);
    if (!limit) {
      limit = globals.limitOfCountriesPerPage;
    }
    var count;
    CountryModel.count()
      .then(function (c) {
        count = c;
        if (count < (page - 1) * limit) {
          page = Math.ceil(count/limit);
        }
        var options = {sort: {name: 1}, skip: (page-1) * limit, limit: limit};
        return CountryModel.find({},{},options);
      })
      .then(function (listCountries) {
        var next;
        next = req.path + '?page=';
        if (count > page * limit) {
          next = true;
        } else {
          next = false;
        }
        return res.status(200).json({
          message:    'List of countries',
          countries:  listCountries,
          next:       next,
        })
      })
      .catch(function (error) {
        return res.status(500).json({
          message:    error.message,
        });
      });
  },

  /**
   * Delete the country details from the db
   * req.params = {
   *    @param {countryCode} string
   * }
   */
  deleteCountry: function (req, res) {
    console.log(req.params);
    var code = req.params.countryCode;
    if (!code) {
      return res.status(400).json({
        message: 'Country not selected',
      });
    }
    CountryModel.remove({code: code})
      .then(function (_result) {
        return res.status(200).json({
          message:  'Delete related mapping and uniqe video',
        });
      })
      .catch(function (error) {
        return res.status(500).json({
          message: error.message,
        });
      });
  }
}