import { testSubmissionHeaders } from '../testSubmission';

function setSearch(search: string) {
  window.history.replaceState({}, '', `/get-a-quote${search}`);
}

describe('testSubmissionHeaders', () => {
  afterEach(() => setSearch(''));

  it('returns no headers without a ?test param', () => {
    setSearch('');
    expect(testSubmissionHeaders()).toEqual({});
  });

  it('returns no headers for an empty ?test=', () => {
    setSearch('?test=');
    expect(testSubmissionHeaders()).toEqual({});
  });

  it('forwards ?test=<value> as X-Test-Submission', () => {
    setSearch('?test=s3cret&utm_source=x');
    expect(testSubmissionHeaders()).toEqual({ 'X-Test-Submission': 's3cret' });
  });
});
