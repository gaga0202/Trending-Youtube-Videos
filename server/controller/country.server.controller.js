var CountryModel  = require('../model/country.server.model.js');
var globals       = require('../../config/globals');
var _             = require('lodash');
var Promise       = require('bluebird');

module.exports = {

  /**
   * Add country and its code to the database
   * req.body = {
   *    @param {name} string
   *    @param {code} string
   * }
   */
  addCountry: function (req, res) {
    var code = req.body.code.toLowerCase();
    var name = req.body.name.toUpperCase();
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
      .then(function (_c) {
        return res.status(201).json({message: 'Country saved'});
      })
      .catch(function (error) {
        if (error.message === '409') {
          return res.status(409).json({message: 'Code Already exists'});
        } else if (error.message === '400') {
          return res.status(400).json({message: 'Bad Request'});
        } else {
          return res.status(500).json({message: error.message});
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
    var code = req.query.code;
    var fromListCountries = req.query.fromListCountries;
    var query = {};
    if (code){
      query.code = code.toLowerCase();
    }
    var count;
    CountryModel.count(query)
      .then(function (c) {
        count = c;
        if (count < (page - 1) * limit) {
          page = Math.ceil(count/limit);
        }
        var options = {sort: {name: 1}, skip: (page-1) * limit, limit: limit};
        return CountryModel.find(query, {}, options);
      })
      .then(function (listCountries) {
        var resultArray = listCountries;
        if (fromListCountries){
          resultArray = _.filter(listCountries, function(o) { 
            return o.code.toLowerCase() !== 'au'; 
          });
        }
        var next;
        next = req.path + '?page=';
        if (count > page * limit) {
          next = true;
        } else {
          next = false;
        }
        return res.status(200).json({
          message:    'List of countries',
          countries:  resultArray,
          next:       next,
        });
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
    var code = req.params.countryCode.toLowerCase();
    if (!code) {
      return res.status(400).json({
        message: 'Country not selected',
      });
    }
    // because home page is dependent on code au
    if (code === 'au') {
      return res.status(400).json({
        message:    'Australia can\'t be deleted from records',
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
  },

  editCountry: function (req, res) {
    var previousCode = req.body.previousCode.toLowerCase();
    var newCode      = req.body.newCode.toLowerCase();
    var newName      = req.body.newName.toUpperCase();
    if (previousCode === 'au') {
      return res.status(400).json({
        message:    'Australia can\'t be deleted from records',
      });
    }
    CountryModel.findOneAndUpdate(
        {code: previousCode}, 
        {$set: {code: newCode, name: newName}}
      )
      .then(function (result) {
        if (!result) {
          throw new Error('previous code not found');
        }
        return res.status(200).json({
          message:    'Country Record updated',
        });
      })
      .catch(function (error) {
        console.log(error);
        if (error.message === 'previous code not found'){
          return res.status(404).json({
            message:    'Country not found',
          });
        } else if (error.name === 'MongoError' 
          && error.codeName === 'DuplicateKey'){
            return res.status(400).json({
              message:    'New country already exists',
            });
        } else {
          return res.status(500).json({
            message:    error.message,
          });
        }
      });
  },

  getAll: function (req, res) {
    var options = {sort: {name:  1}};
    return CountryModel.find({}, {}, options)
      .then(function (result) {
        return res.status(200).json({
          message:        'All countries list',
          countries:      mapCountries(result),
        });
      })
      .catch(function (error) {
        console.log(error);
        return res.status(500).json({
          message:    error.message,
        });
      });
  },
};

function mapCountries(countries) {
  var countryArray = _.map(countries, function (country) {
    return mapCountry(country);
  } );
  return countryArray;
}

function mapCountry(country) {
  var result = {
    countryName:  country.name,
    countryCode:  country.code,
  };
  return result;
}