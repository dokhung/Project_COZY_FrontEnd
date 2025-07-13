export default function Features() {
  return (
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">기능 소개</h1>
        <p className="mb-10 text-gray-700">
          이 페이지에서는 서비스에서 제공하는 주요 기능을 자세히 안내합니다.
        </p>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-2">대시보드</h2>
          <p className="mb-4 text-gray-600">
            프로젝트 전반의 진행 상황과 주요 정보를 한 화면에서 확인할 수 있습니다.
            할 일, 상태, 일정 등을 대시보드에서 한눈에 파악해 업무 효율을 높입니다.
          </p>
          <img
              src={'/dashboard.png'}
              alt="대시보드 화면 예시"
              className="w-full border border-gray-200 rounded"
          />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-2">계획</h2>
          <p className="mb-4 text-gray-600">
            새로운 계획을 생성하고, 세부 내용을 입력하여 체계적으로 업무를 관리할 수 있습니다.
            작성된 계획은 리스트로 확인하며 필요한 작업을 손쉽게 편집하고 완료 처리할 수 있습니다.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <img
                src="/plan_1.png"
                alt="계획 리스트 화면 예시"
                className="w-full border border-gray-200 rounded"
            />
            <img
                src="/plan_2.png"
                alt="계획 작성 화면 예시"
                className="w-full border border-gray-200 rounded"
            />
          </div>
        </section>


        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-2">캘린더</h2>
          <p className="mb-4 text-gray-600">
            월별 달력에 계획된 작업을 표시해 일정 관리를 직관적으로 지원합니다.
            일정을 한눈에 확인하며 필요한 기간에 맞춰 조정할 수 있습니다.
          </p>
          <img
              src="/calendar.png"
              alt="캘린더 화면 예시"
              className="w-full border border-gray-200 rounded"
          />
        </section>
      </main>
  );
}
