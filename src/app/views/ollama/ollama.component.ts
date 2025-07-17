import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// Importante!
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { OllamaRequest } from '../../models/OllamaRequest';
import { OllamaResponse } from '../../models/OllamaResponse';
import { Observable } from 'rxjs';

@Component({
  templateUrl: 'ollama.component.html',
  styleUrls: ['ollama.component.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, HttpClientModule]
})
export class OllamaComponent implements OnInit {
    constructor(private h: HttpClient) { }

    prompt = '';
    response = '';
    model = '';
    len : number=2048;
    temperature : number=1;

    ngOnInit(): void {
        this.prompt = '';
        this.response = '';
        this.model = 'deepseek-coder:6.7b-instruct';
    }

    private apiUrl = 'http://localhost:11434/api/generate';
    generate(request: OllamaRequest): Observable<OllamaResponse> {
        return this.h.post<OllamaResponse>(this.apiUrl, request);
    }

    enviar() {
        this.response = 'Executando...';
        const request: OllamaRequest = {
            model: this.model,
            prompt: this.prompt,
            stream: false,
            lenght: this.len,
            temperature: this.temperature
        };
        this.generate(request).subscribe({
            next: (res: OllamaResponse) => this.response = res.response,
            error: err => this.response = 'Erro: ' + (err.error?.message || err.message)
        });
    }
}