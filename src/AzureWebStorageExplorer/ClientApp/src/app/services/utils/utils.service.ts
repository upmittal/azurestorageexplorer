import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})
export class UtilsService {

	baseUrl: string;

	private account: string | null;
	private key: string | null;

	constructor(private http: HttpClient, @Inject('BASE_URL') baseUrl: string) {

		this.baseUrl = baseUrl;
		this.account = null;
		this.key = null;

	}

	private loadCredentials(url: string) {

		let credentials = '?account=' + this.getAccount() + '&key=' + this.getKey();

		if (url.lastIndexOf('?') > 0)
			credentials = credentials.replace('?', '&');

		return credentials;
	}

	getAccount() {
		if (!this.account)
			this.account = localStorage.getItem('account');
		return this.account;
	}

	getKey() {
		if (!this.key)
			this.key = localStorage.getItem('key');
		return this.key;
	}

	signIn(account: string, key: string) {
		return this.http.get(this.baseUrl + 'api/Queues/GetQueues?account=' + account + '&key=' + key);
	}

	saveCredntials(account: string, key: string) {
		localStorage.setItem('account', account);
		localStorage.setItem('key', key);
	}

	clearCredentials() {
		this.account = null;
		this.key = null;
		localStorage.clear();
	}

	getData(url: string) {
		let credentials = this.loadCredentials(url);
		return this.http.get(this.baseUrl + url + credentials, { responseType: "text" });
	}

	getFile(url: string) {
		let credentials = this.loadCredentials(url);
		return this.http.get(this.baseUrl + url + credentials, { responseType: "blob", observe: "response" });
	}

	postData(url: string, body: any) {
		let credentials = this.loadCredentials(url);
		return this.http.post(this.baseUrl + url + credentials, body);
	}

	putData(url: string, body: any) {
		let credentials = this.loadCredentials(url);
		return this.http.put(this.baseUrl + url + credentials, body);
	}

	deleteData(url: string) {
		let credentials = this.loadCredentials(url);
		return this.http.delete(this.baseUrl + url + credentials);
	}

	uploadFile(url: string, data: FormData) {
		const xhr = new XMLHttpRequest();
		let credentials = this.loadCredentials(url);
		xhr.open('POST', this.baseUrl + url + credentials, true);
		xhr.send(data);
		return xhr;
	}
}
