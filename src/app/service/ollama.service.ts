/*
import { retry, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';


import { OllamaRequest } from '../models/OllamaRequest'
import { OllamaResponse } from '../models/OllamaResponse';

export class OllamaService {
      protected http: HttpClient;

      private apiUrl = 'http://localhost:11434/api/generate';
      generate(request: OllamaRequest): Observable<OllamaResponse> {
        return this.http.post<OllamaResponse>(this.apiUrl, request);
      }
}
*/