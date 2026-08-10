export class SearchAdapter {
  async search(params: any): Promise<any> { throw new Error('Not implemented'); }
  async suggest(query: string): Promise<any> { throw new Error('Not implemented'); }
  async trending(): Promise<any[]> { throw new Error('Not implemented'); }
  abort(): void { /* cancel in-flight requests */ }
}
