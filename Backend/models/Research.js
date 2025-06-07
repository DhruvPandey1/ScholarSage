const mongoose = require('mongoose');
const ResearchSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 100,
    },
    papers: [{
        id: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        title: {
            type: String,
            required: true,
            trim: true,
            minlength: 5,
            maxlength: 500
        },
        authors: [{
            type: String,
            trim: true,
            minlength: 3,
            maxlength: 100
        }],
        abstract: {
            type: String,
            required: true,
            trim: true,
            minlength: 10,
            maxlength: 5000
        },
        publishedDate: {
            type: Date,
            default: Date.now
        },
        arxivUrl: {
            type: String,
            trim: true,
            validate: {
                validator: function (v) {
                    return /^(https?:\/\/)?(www\.)?arxiv\.org\/abs\/[0-9]{4}\.[0-9]{4,5}(v[0-9]+)?$/.test(v);
                },
                message: props => `${props.value} is not a valid arXiv URL!`
            }
        },
        categories: [{
            type: String,
            trim: true,
            minlength: 3,
            maxlength: 50
        }]
    }],
    summaries: [{
    paperId: {
      type: String,
      required: true,
      trim: true
    },
    keyFindings: [{
      type: String,
      trim: true,
      minlength: 5,
      maxlength: 1000
    }],
    methodology: {
      type: String,
      trim: true,
      minlength: 5,
      maxlength: 1000
    },
    significance: {
      type: String,
      trim: true,
      minlength: 5,
      maxlength: 1000
    }
  }],
  critiques: [{
    paperId: {
      type: String,
      required: true,
      trim: true
    },
    strengths: [{
      type: String,
      trim: true,
      minlength: 5,
      maxlength: 1000
    }],
    limitations: [{
      type: String,
      trim: true,
      minlength: 5,
      maxlength: 1000
    }],
    score: {
      type: Number,
      min: 0,
      max: 10
    },
    recommendation: {
      type: String,
      trim: true,
      minlength: 5,
      maxlength: 1000
    }
  }],
  graphData: {
    nodes: [{
      id: {
        type: String,
        required: true,
        trim: true
      },
      label: {
        type: String,
        required: true,
        trim: true
      },
      type: {
        type: String,
        enum: ['paper', 'topic', 'author'],
        required: true
      },
      size: {
        type: Number,
        min: 1
      }
    }],
    links: [{
      source: {
        type: String,
        required: true,
        trim: true
      },
      target: {
        type: String,
        required: true,
        trim: true
      },
      strength: {
        type: Number,
        min: 0,
        max: 1
      }
    }]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Research', ResearchSchema);
