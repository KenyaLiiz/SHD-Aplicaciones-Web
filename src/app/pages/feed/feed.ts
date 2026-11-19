import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Post } from '../../models/post.model';
import { PostService } from '../../services/post/post';
import { Router } from '@angular/router';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div style="max-width: 600px; margin: 30px auto; font-family: Arial; padding: 0 15px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h2>Muro / Feed Principal (SHD)</h2>
        <button (click)="cerrarSesion()" style="background: #dc3545; color: white; padding: 8px 12px; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">
          Cerrar Sesión
        </button>
      </div>

      <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; border: 1px solid #e9ecef; margin-bottom: 25px;">
        <h3>{{ editandoId ? 'Editar Publicación' : '¿Qué estás pensando?' }}</h3>
        <input type="text" placeholder="Título del post..." [(ngModel)]="nuevoTitulo" style="width: 100%; margin-bottom: 10px; padding: 8px; box-sizing: border-box; border: 1px solid #ced4da; border-radius: 4px;" />
        <textarea placeholder="Escribe tu contenido aquí..." [(ngModel)]="nuevoContenido" rows="3" style="width: 100%; margin-bottom: 10px; padding: 8px; box-sizing: border-box; border: 1px solid #ced4da; border-radius: 4px;"></textarea>
        
        <div>
          <button (click)="guardarPost()" style="background: #28a745; color: white; padding: 8px 15px; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">
            {{ editandoId ? 'Actualizar' : 'Publicar' }}
          </button>
          <button *ngIf="editandoId" (click)="cancelarEdicion()" style="background: #6c757d; color: white; padding: 8px 15px; border: none; border-radius: 4px; cursor: pointer; margin-left: 8px;">
            Cancelar
          </button>
        </div>
      </div>

      <div>
        <div *ngFor="let post of posts" style="border: 1px solid #dee2e6; padding: 15px; border-radius: 8px; margin-bottom: 12px; background: #fff; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
          <h4 style="margin: 0 0 8px 0; color: #007bff;">{{ post.title }}</h4>
          <p style="margin: 0 0 12px 0; color: #333; line-height: 1.4;">{{ post.body }}</p>
          <div>
            <button (click)="cargarParaEditar(post)" style="background: #ffc107; color: #000; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; margin-right: 6px; font-weight: bold;">Editar</button>
            <button (click)="eliminarPost(post.id!)" style="background: #6c757d; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-weight: bold;">Eliminar</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class FeedComponent implements OnInit {
  posts: Post[] = [];
  nuevoTitulo = '';
  nuevoContenido = '';
  editandoId: number | null = null;

  constructor(private postService: PostService, private router: Router) {}

  ngOnInit(): void {
    this.obtenerPosts();
  }

  obtenerPosts() {
    this.postService.getPosts().subscribe({
      next: (data: Post[]) => {
        this.posts = data.slice(0, 10);
      },
      error: (err: any) => console.error('Error al obtener posts', err)
    });
  }

  guardarPost() {
    if (!this.nuevoTitulo.trim() || !this.nuevoContenido.trim()) {
      alert('Por favor completa todos los campos.');
      return;
    }

    if (this.editandoId) {
      const postActualizado: Post = { id: this.editandoId, title: this.nuevoTitulo, body: this.nuevoContenido, userId: 1 };
      this.postService.updatePost(this.editandoId, postActualizado).subscribe({
        next: () => {
          const index = this.posts.findIndex((p: Post) => p.id === this.editandoId);
          if (index !== -1) this.posts[index] = postActualizado;
          this.cancelarEdicion();
        }
      });
    } else {
      const nuevoPost: Post = { title: this.nuevoTitulo, body: this.nuevoContenido, userId: 1 };
      this.postService.createPost(nuevoPost).subscribe({
        next: (res: Post) => {
          this.posts.unshift(res);
          this.cancelarEdicion();
        }
      });
    }
  }

  cargarParaEditar(post: Post) {
    this.editandoId = post.id!;
    this.nuevoTitulo = post.title;
    this.nuevoContenido = post.body;
  }

  cancelarEdicion() {
    this.editandoId = null;
    this.nuevoTitulo = '';
    this.nuevoContenido = '';
  }

  eliminarPost(id: number) {
    this.postService.deletePost(id).subscribe({
      next: () => {
        this.posts = this.posts.filter((p: Post) => p.id !== id);
      }
    });
  }

  cerrarSesion() {
    localStorage.removeItem('token');
    void this.router.navigate(['/login']);
  }
}