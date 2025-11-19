// models/Post.js
const mongoose = require('mongoose');

/**
 * Schema de Comentário
 */
const CommentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true,
        maxlength: 500
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

/**
 * Schema de Post
 */
const PostSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    authorName: {
        type: String,
        required: true
    },
    authorType: {
        type: String,
        enum: ['usuario', 'tatuador'],
        required: true
    },
    description: {
        type: String,
        required: true,
        maxlength: 500
    },
    imageUrl: {
        type: String,
        required: true
    },
    tags: [{
        type: String,
        trim: true
    }],
    estilos: [{
        type: String,
        enum: [
            'old-school',
            'realismo',
            'blackwork',
            'aquarela',
            'minimalista',
            'geometrico',
            'tribal',
            'japones',
            'tradicional',
            'outro'
        ]
    }],
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    likesCount: {
        type: Number,
        default: 0
    },
    comments: [CommentSchema],
    commentsCount: {
        type: Number,
        default: 0
    },
    views: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Índices para melhorar performance
PostSchema.index({ author: 1, createdAt: -1 });
PostSchema.index({ tags: 1 });
PostSchema.index({ estilos: 1 });
PostSchema.index({ likesCount: -1 });

/**
 * Método para adicionar like
 */
PostSchema.methods.addLike = function (userId) {
    if (!this.likes.includes(userId)) {
        this.likes.push(userId);
        this.likesCount = this.likes.length;
    }
    return this.save();
};

/**
 * Método para remover like
 */
PostSchema.methods.removeLike = function (userId) {
    this.likes = this.likes.filter(id => id.toString() !== userId.toString());
    this.likesCount = this.likes.length;
    return this.save();
};

/**
 * Método para adicionar comentário
 */
PostSchema.methods.addComment = function (userId, userName, text) {
    this.comments.push({
        user: userId,
        userName: userName,
        text: text
    });
    this.commentsCount = this.comments.length;
    return this.save();
};

/**
 * Método para remover comentário
 */
PostSchema.methods.removeComment = function (commentId) {
    this.comments = this.comments.filter(comment => comment._id.toString() !== commentId.toString());
    this.commentsCount = this.comments.length;
    return this.save();
};

/**
 * Método para incrementar views
 */
PostSchema.methods.incrementViews = function () {
    this.views += 1;
    return this.save();
};

module.exports = mongoose.model('Post', PostSchema);
