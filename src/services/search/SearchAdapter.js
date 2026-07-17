export class SearchAdapter {
  async search(params) { throw new Error('Not implemented'); }
  async suggest(query) { throw new Error('Not implemented'); }
  async trending() { throw new Error('Not implemented'); }
  abort() { /* cancel in-flight requests */ }
}
