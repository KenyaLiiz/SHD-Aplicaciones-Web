import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { PostService } from './post';

describe('PostService', () => {
  let service: PostService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [PostService, provideHttpClient()] });
    service = TestBed.inject(PostService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
