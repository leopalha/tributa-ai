"use client"

import { useState } from 'react';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Comment {
  id: string;
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  createdAt: Date;
}

interface CommentsSectionProps {
  declaracaoId: string;
  currentUser: {
    name: string;
    avatar: string;
  };
  initialComments?: Comment[];
}

export function CommentsSection({
  declaracaoId,
  currentUser,
  initialComments = [],
}: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    setIsSubmitting(true);

    try {
      const comment: Comment = {
        id: Math.random().toString(36).substring(7),
        content: newComment,
        author: currentUser,
        createdAt: new Date(),
      };

      setComments((prev) => [...prev, comment]);
      setNewComment('');
      toast.success('Comentário adicionado com sucesso!');
    } catch (error) {
      toast.error('Erro ao adicionar comentário. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
      toast.success('Comentário removido com sucesso!');
    } catch (error) {
      toast.error('Erro ao remover comentário. Tente novamente.');
    }
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <ScrollArea className="h-[400px] pr-4">
          {comments.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Nenhum comentário ainda. Seja o primeiro a comentar!
            </p>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="flex items-start gap-4 bg-muted/50 rounded-lg p-4"
                >
                  <Avatar>
                    <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                    <AvatarFallback>
                      {comment.author.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{comment.author.name}</p>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(comment.createdAt, {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{comment.content}</p>
                    {comment.author.name === currentUser.name && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive/90"
                        onClick={() => handleDeleteComment(comment.id)}
                      >
                        Excluir
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <div className="space-y-2">
          <Textarea
            placeholder="Adicione um comentário..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[100px]"
          />
          <Button
            onClick={handleSubmitComment}
            disabled={!newComment.trim() || isSubmitting}
            className="w-full"
          >
            {isSubmitting ? 'Enviando...' : 'Enviar comentário'}
          </Button>
        </div>
      </div>
    </Card>
  );
} 