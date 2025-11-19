// middleware/upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Garantir que os diretórios de upload existam
const uploadDirs = {
    avatars: path.join(__dirname, '../../uploads/avatars'),
    posts: path.join(__dirname, '../../uploads/posts'),
};

Object.values(uploadDirs).forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Configuração de armazenamento
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Define o diretório baseado no tipo de upload
        const uploadType = req.body.uploadType || 'posts';
        const dir = uploadDirs[uploadType] || uploadDirs.posts;
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        // Gera nome único para o arquivo
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

// Filtro de arquivos
const fileFilter = (req, file, cb) => {
    const allowedTypes = (process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/jpg,image/webp').split(',');

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Tipo de arquivo não permitido. Apenas imagens são aceitas.'), false);
    }
};

// Configuração do multer
const upload = multer({
    storage: storage,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 // 5MB padrão
    },
    fileFilter: fileFilter
});

// Middleware de tratamento de erros de upload
const handleUploadError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'Arquivo muito grande. Tamanho máximo: 5MB' });
        }
        return res.status(400).json({ error: 'Erro no upload: ' + err.message });
    } else if (err) {
        return res.status(400).json({ error: err.message });
    }
    next();
};

module.exports = {
    upload,
    handleUploadError
};
