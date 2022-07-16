import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchGifsResponse, Gif } from '../interfaces/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private _historial: string[] = [];
  private apiKey: string = '7BtaHnqhkbXP03W5T2vxXqoPbueLlMIz';
  private url: string = `https://api.giphy.com/v1/gifs/search?api_key=${this.apiKey}`;
  
  public resultados: Gif[] = [];
  
  get historial(): string[] {
    return [...this._historial];
  }

  constructor(private http: HttpClient) {
    if(localStorage.getItem('historial'))
      this._historial = JSON.parse(localStorage.getItem('historial')!);

    if (localStorage.getItem('resultados'))
      this.resultados = JSON.parse(localStorage.getItem('resultados')!);
  }

  buscarGifs(query: string): void {

    query = query.trim().toLowerCase();

    if (!this._historial.includes(query)) {
      this._historial.unshift(query);
      this._historial = this._historial.splice(0, 11);

      localStorage.setItem('historial', JSON.stringify(this._historial));
    }

    this.http.get<SearchGifsResponse>(`${this.url}&q=${query}&limit=10`)
    .subscribe((resp: SearchGifsResponse) => {
      this.resultados = resp.data;
      localStorage.setItem('resultados', JSON.stringify(this.resultados));
    });

  }

}
