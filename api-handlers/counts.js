// =============================================================================
// /functions/api/community/counts.js
// GET — returns aggregate counts for the home page and survey page
// { survey_total, survey_yes, survey_some, survey_no, survey_learn,
//   standing_total, standing_alamogordo, standing_regional, subscribers_total }
// =============================================================================

export async function onRequestGet(context) {
  const { env } = context;

  try {
    const [surveyTotal, yes, some, noN, learn, standingTotal, alamo, regional, subs] = await Promise.all([
      env.DB.prepare("SELECT COUNT(*) AS n FROM survey_responses").first(),
      env.DB.prepare("SELECT COUNT(*) AS n FROM survey_responses WHERE answer = 'yes'").first(),
      env.DB.prepare("SELECT COUNT(*) AS n FROM survey_responses WHERE answer = 'some'").first(),
      env.DB.prepare("SELECT COUNT(*) AS n FROM survey_responses WHERE answer = 'no'").first(),
      env.DB.prepare("SELECT COUNT(*) AS n FROM survey_responses WHERE answer = 'learn'").first(),
      env.DB.prepare("SELECT COUNT(*) AS n FROM standing_list").first(),
      env.DB.prepare("SELECT COUNT(*) AS n FROM standing_list WHERE residency = 'alamogordo'").first(),
      env.DB.prepare("SELECT COUNT(*) AS n FROM standing_list WHERE residency = 'regional'").first(),
      env.DB.prepare("SELECT COUNT(*) AS n FROM email_subscribers").first(),
    ]);

    return new Response(
      JSON.stringify({
        survey_total: surveyTotal?.n || 0,
        survey_yes: yes?.n || 0,
        survey_some: some?.n || 0,
        survey_no: noN?.n || 0,
        survey_learn: learn?.n || 0,
        standing_total: standingTotal?.n || 0,
        standing_alamogordo: alamo?.n || 0,
        standing_regional: regional?.n || 0,
        subscribers_total: subs?.n || 0,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=60",
        },
      }
    );
  } catch (e) {
    return new Response("DB error", { status: 500 });
  }
}
