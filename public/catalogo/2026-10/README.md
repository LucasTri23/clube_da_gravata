# Fotos dos conjuntos — outubro de 2026

Origem: `C:/Users/lucas/Downloads/lenco/gravata-lenco-abotoadura.jpeg`.
Os três conjuntos foram separados com a ferramenta integrada image_gen e conferidos visualmente antes da importação. As imagens finais ficam nesta pasta e também no Storage do Supabase, vinculadas aos produtos de R$ 70,00.

Arquivos: `kit-verde.png`, `kit-vinho.png`, `kit-dourado.png`.

Prompt usado em cada imagem, substituindo SUBJECT:

> Use case: precise-object-edit. Edit target: attached photo of three boxed tie, pocket square and cufflink sets. Produce ONE separate catalogue photograph of ONLY the SUBJECT. Simply crop out the other two boxes, preserve the exact original visible product, packaging, patterns, colours, plastic glare, camera angle and texture. Do not reconstruct, redesign or invent any product details. Keep the original wooden backdrop where visible. Frame the single box closely, landscape aspect ratio. No added text, props, branding or other boxes. Save output for use in a product catalogue.

SUBJECT por arquivo:

- Verde: top olive green box with red and white tiny diamonds.
- Vinho: middle burgundy red box with blue and gold floral motifs.
- Dourado: bottom mustard gold box with blue floral motifs.

Importação: `node scripts/import-catalog-october.mjs --apply`. Sem `--apply`, o comando apresenta uma prévia. A importação identifica as fotos pelo hash para permitir novas execuções sem duplicar os produtos desta importação. Relatórios e backup ficam em `.local/catalog-backups/`.
