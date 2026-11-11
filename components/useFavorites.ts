'use client';
import {useEffect, useRef, useState} from 'react';
import {getBrowserClient} from '../lib/supabase-browser';

export function useFavorites() {
  const [saved, setSaved] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState('');
  const [ready, setReady] = useState(false);
  const generation = useRef(0);
  const writing = useRef(false);
  useEffect(() => {
    const client = getBrowserClient();
    if (!client) {setBusy(false); setReady(true); return;}
    const {data} = client.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user.id ?? null);
      setReady(true);
    });
    return () => {data.subscription.unsubscribe(); generation.current++;};
  }, []);
  useEffect(() => {
    if (!ready) return;
    const token = ++generation.current;
    setSaved([]); setError('');
    const client = getBrowserClient();
    if (!userId || !client) {setBusy(false); return;}
    setBusy(true);
    client.from('favorites').select('product_slug').eq('user_id', userId).then(({data,error}) => {
      if (generation.current !== token) return;
      if (error) setError('Não foi possível carregar seus favoritos. Recarregue a página para tentar novamente.');
      else setSaved(data.map(row=>row.product_slug));
      setBusy(false);
    });
    return () => {generation.current++;};
  }, [ready,userId]);
  async function toggle(slug: string) {
    if (busy || writing.current) return;
    if (!userId) {setSaved(previous=>previous.includes(slug)?previous.filter(item=>item!==slug):[...previous,slug]); return;}
    const client = getBrowserClient();
    if (!client) return;
    const token = generation.current;
    const remove = saved.includes(slug);
    writing.current = true; setBusy(true); setError('');
    try {
      const result = remove
        ? await client.from('favorites').delete().eq('user_id',userId).eq('product_slug',slug).select('product_slug')
        : await client.from('favorites').insert({user_id:userId,product_slug:slug}).select('product_slug');
      if (generation.current !== token) return;
      if (result.error || result.data?.length !== 1) throw new Error('Write not confirmed');
      setSaved(previous=>remove?previous.filter(item=>item!==slug):[...previous,slug]);
    } catch {
      if (generation.current === token) setError('Não foi possível atualizar o favorito. Tente novamente.');
    } finally {
      writing.current = false;
      if (generation.current === token) setBusy(false);
    }
  }
  return {saved, busy, error, signedIn: !!userId, toggle};
}
