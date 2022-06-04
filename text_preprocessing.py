import re
import pymorphy2

from constants import UA_ABBREVIATIONS, UA_STOPWORDS

morph = pymorphy2.MorphAnalyzer(lang='uk')

SPACES_REG = re.compile(r'[^\s]+')
END_SYMBOLS_REG = re.compile(r'.*\.|\!|\?|\.{3}|\…|\»$')
BIG_LETTER_REG = re.compile(r'^[А-Я\Ї\І\Є]')
WORD_REG = re.compile(r"\w+://(?:[a-zA-Z]|[0-9]|[$-_@.&+])+|[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+|[0-9]+-[а-яА-ЯіїІЇ'’`]+|[+-]?[0-9](?:[0-9,.-]*[0-9])?|[\w](?:[\w'’`-]?[\w]+)*|\w.(?:\w.)+\w?|[\"#$%&*+,/:;<=>@^`~…\\(\\)⟨⟩{}\\[\\|\\]‒–—―«»“”‘’'№]|[.!?]+|-+")


def my_tokenizer(text):
    return list(filter(lambda item: len(item) > 0, map(lambda item: item.replace('.', ''), text.split(' '))))


def normalize_word(word):
    try:
        return morph.parse(word)[0].normal_form
    except:
        return word


def filter_by(func, lst):
    return list(filter(func, lst))


def map_by(func, lst):
    return list(map(func, lst))


def split_by_paragraph(text):
    return text.splitlines()


def split_by_sentence(paragraph, normalize):
    tokens = SPACES_REG.findall(paragraph)
    sentences = []
    sentence = []
    for i in range(len(tokens)):
        curr_tok = tokens[i]
        if i + 1 != len(tokens):
            next_tok = tokens[i + 1]
            if bool(END_SYMBOLS_REG.match(curr_tok)) and bool(BIG_LETTER_REG.match(next_tok)) and not (curr_tok in UA_ABBREVIATIONS) and not curr_tok.startswith('('):
                sentence.append(curr_tok)
                sentence = list(map(lambda tok: normalize_word(tok) if normalize else tok, list(
                    filter(lambda tok: tok != '.', WORD_REG.findall(' '.join(sentence).lower())))))
                sentences.append(
                    list(filter(lambda item: not item in UA_STOPWORDS, sentence)))
                sentence = []
            else:
                sentence.append(curr_tok)
        else:
            sentence.append(curr_tok)
            sentence = list(map(lambda tok: normalize_word(tok) if normalize else tok, list(
                filter(lambda tok: tok != '.', WORD_REG.findall(' '.join(sentence).lower())))))
            sentences.append(
                list(filter(lambda item: not item in UA_STOPWORDS, sentence)))
            sentence = []
    return sentences


def split_by_sentences(paragraphs, normalize):
    return map_by(lambda paragraph: split_by_sentence(paragraph, normalize), paragraphs)


def process_texts(texts, normalize=True):
    texts_paragraphs = map_by(split_by_paragraph, texts)
    texts_paragraphs = list(map(lambda paragraphs: list(
        filter(lambda paragraph: len(paragraph) > 0, paragraphs)), texts_paragraphs))
    texts_sentences = map_by(lambda paragraphs: split_by_sentences(
        paragraphs, normalize), texts_paragraphs)
    processed_texts = list(map(lambda paragraphs: '. '.join(list(map(lambda sentences: '. '.join(
        list(map(lambda sentence: ' '.join(sentence), sentences))), paragraphs))), texts_sentences))
    return processed_texts
