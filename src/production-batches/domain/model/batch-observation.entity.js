export class BatchObservation {
    constructor({
                    id = 0,
                    batchId = 0,
                    authorName = '',
                    author = '',
                    category = 'General',
                    content = '',
                    text = '',
                    createdAt = '',
                    timestamp = ''
                } = {}) {
        this.id = id;
        this.batchId = batchId;
        this.authorName = authorName || author;
        this.author = author || authorName;
        this.category = category;
        this.content = content || text;
        this.text = text || content;
        this.createdAt = createdAt || timestamp || new Date().toLocaleString();
        this.timestamp = timestamp || createdAt || this.createdAt;
    }
}